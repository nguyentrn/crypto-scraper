import axios from "axios";

import db from "../src/database/index";

const updateBinanceOHLCVs = async (symbols) => {
  console.log(symbols);
  const ohlcvs = [];
  for (let i = 0; i < symbols.length; i++) {
    const { symbol, max } = symbols[i];
    const res = await axios(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1000&startTime=${
        max ? max.getTime() : 0
      }`
    );
    res.data.forEach((ohlcv) =>
      ohlcvs.push({
        time: new Date(ohlcv[0]),
        open: ohlcv[1],
        high: ohlcv[2],
        low: ohlcv[3],
        close: ohlcv[4],
        volume: ohlcv[5],
        trades: ohlcv[8],
        taker_volume: ohlcv[9],
        symbol,
      })
    );
    console.log(symbol, new Date(res.data[0][0]));
  }

  await db("ohlcvs").insert(ohlcvs).onConflict(["time", "symbol"]).merge();
};

export default updateBinanceOHLCVs;
