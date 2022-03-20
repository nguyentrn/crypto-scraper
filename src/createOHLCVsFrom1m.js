import axios from "axios";
import lodash, { max, min } from "lodash";

import db from "./database/index";

const createOHLCVsFrom1m = async (interval = 5) => {
  let isRunning = true;
  while (isRunning) {
    const from = await db
      .withSchema("ohlcvs")
      .from(`binance_btcusdt_${interval}m`)
      .select("*")
      .orderBy("time", "desc")
      .first();
    const m1s = await db
      .withSchema("ohlcvs")
      .from("binance_btcusdt_1m")
      .select("*")
      .orderBy("time")
      .where("time", ">", (from && from.time) || new Date("2010-01-01"))
      .limit(5000 * interval);
    if (m1s.length < 5000 * interval) {
      isRunning = false;
    }

    const ohlcvs = [];
    let i = 0;
    while (m1s.length) {
      if (!(m1s[i]?.time.getTime() % (interval * 60 * 1000))) {
        const m1sByInterval = m1s.splice(0, i + 1);
        const mBig = {};
        mBig.time = m1sByInterval[m1sByInterval.length - 1].time;
        if (!(mBig.time.getTime() % (interval * 60 * 1000))) {
          mBig.open = m1sByInterval[0].open;
          mBig.high = max(m1sByInterval.map(({ high }) => high));
          mBig.low = min(m1sByInterval.map(({ low }) => low));
          mBig.close = m1sByInterval[m1sByInterval.length - 1].close;
          mBig.volume = m1sByInterval
            .map(({ volume }) => volume)
            .reduce((s, v) => s + v)
            .toFixed(8);
          mBig.trades = m1sByInterval
            .map(({ trades }) => trades)
            .reduce((s, v) => s + v);
          mBig.taker_volume = m1sByInterval
            .map(({ taker_volume }) => taker_volume)
            .reduce((s, v) => s + v)
            .toFixed(8);

          ohlcvs.push(mBig);
        }
        i = 0;
      }
      i++;
    }
    console.log(ohlcvs.length);
    await db
      .withSchema("ohlcvs")
      .from(`binance_btcusdt_${interval}m`)
      .insert(ohlcvs)
      .onConflict("time")
      .merge();
  }
  //   for (let i=0;i<ohlcvs.length;i+=5000){

  //   }
  //   const ohlcvs = [];
  //   for (let i = 0; i < m1s.length; i += 5) {
  //     const m1ByInterval = m1s.slice(i, i + 5);
  //     const ohlcv = {};
  //     ohlcv.time = m1ByInterval[interval - 1]?.time;

  //     console.log(ohlcv);
  //   }
};

export default createOHLCVsFrom1m;
