import axios from "axios";

import db from "../src/database/index";

const updateBinanceOHLCVs = async (interval) => {
  const tables = await db.raw(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'ohlcvs' AND table_name ~* '1m'`
  );
  const symbols = tables.rows.map(({ table_name }) =>
    table_name
      .match(/_\w*_/gi)[0]
      .replaceAll("_", "")
      .replace("usdt", "")
      .toUpperCase()
  );

  const pairs = await db("coins")
    .select("symbol")
    .whereIn("symbol", symbols)
    .orderBy("rank")
    .limit(6);

  for (let i = 0; i < pairs.length; i++) {
    const symbol = pairs[i].symbol;
    const table = `binance_${symbol.toLowerCase()}usdt_1m`;
    const data = await db
      .withSchema("ohlcvs")
      .from(table)
      .select("*")
      .orderBy("time", "desc")
      .first();
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=1000&startTime=${
      data && data.time ? data.time.getTime() : 0
    }`;
    const res = await axios(url);
    const ohlcvs = res.data.map((ohlcv) => ({
      time: new Date(ohlcv[0]),
      open: ohlcv[1],
      high: ohlcv[2],
      low: ohlcv[3],
      close: ohlcv[4],
      volume: ohlcv[5],
      trades: ohlcv[8],
      taker_volume: ohlcv[9],
    }));
    console.log(symbol, new Date(res.data[0][0]));
    await db
      .withSchema("ohlcvs")
      .from(table)
      .insert(ohlcvs)
      .onConflict("time")
      .merge();
  }
};

export default updateBinanceOHLCVs;
