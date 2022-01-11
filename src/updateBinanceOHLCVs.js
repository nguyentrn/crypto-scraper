import axios from "axios";

import db from "../src/database/index";

const updateBinanceOHLCVs = async () => {
  const symbols = await db
    .with(
      "last",
      db("ohlcvs").select(db.raw("symbol, max(time)")).groupBy("symbol")
    )
    .from("binance_trading_pairs")
    .join("coins", "binance_trading_pairs.baseAsset", "coins.symbol")
    .join("last", "binance_trading_pairs.symbol", "last.symbol")
    .select(["binance_trading_pairs.symbol", "last.max"])
    .where("rank", "<", 1000)
    .where("max", "<", new Date("2022-01-09T22:39:00.000Z"))
    .orderBy("rank")
    .limit(5);

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
  console.log(ohlcvs.length);
  await db("ohlcvs").insert(ohlcvs).onConflict(["time", "symbol"]).merge();
};

export default updateBinanceOHLCVs;
