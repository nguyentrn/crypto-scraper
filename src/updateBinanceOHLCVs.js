import axios from "axios";

import db from "../src/database/index";

const updateBinanceOHLCVs = async (symbol) => {
  const lastOHLCVs = await db("ohlcvs")
    .select("*")
    .orderBy("time", "desc")
    .where("symbol", symbol)
    .first();
  const res = await axios(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1000&startTime=${
      lastOHLCVs ? lastOHLCVs.time.getTime() : 0
    }`
  );
  const data = res.data.map((ohlcv) => ({
    time: new Date(ohlcv[0]),
    open: ohlcv[1],
    high: ohlcv[2],
    low: ohlcv[3],
    close: ohlcv[4],
    volume: ohlcv[5],
    trades: ohlcv[8],
    taker_volume: ohlcv[9],
    symbol,
  }));
  console.log(symbol, data[0]?.time);

  await db("ohlcvs").insert(data).onConflict(["time", "symbol"]).merge();
};

export default updateBinanceOHLCVs;
