import db from "./index";

const intervals = ["1m"];
// const intervals = ["1m", "5m", "10m"];

export default async () => {
  const coins = await db("binance_trading_pairs")
    .join("coins", "binance_trading_pairs.baseAsset", "coins.symbol")
    .select("binance_trading_pairs.symbol")
    .orderBy("rank")
    .whereNotIn("baseAsset", [
      "BUSD",
      "DAI",
      "FEI",
      "FRAX",
      "GUSD",
      "LUSD",
      "TUSD",
      "USDC",
      "USDN",
      "USDP",
      "USDT",
      "UST",
    ])
    .limit(24);
  for (let i = 0; i < coins.length; i++) {
    for (let j = 0; j < intervals.length; j++) {
      const tableName = `binance_${coins[i].symbol.toLowerCase()}_${
        intervals[j]
      }`;
      const data = await db
        .withSchema("ohlcvs")
        .from(tableName)
        // .select("*")
        .where("time", ">=", "2021-06-01")
        .del();
      console.log(data);
    }
  }
  console.log(coins);
};
