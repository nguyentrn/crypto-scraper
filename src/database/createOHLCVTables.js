import db from "./index";

const intervals = ["1m"];
// const intervals = ["1m", "5m", "10m"];

(async () => {
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
      try {
        const hasTable = await db.schema
          .withSchema("ohlcvs")
          .hasTable(tableName);
        if (!hasTable) {
          await db.schema
            .withSchema("ohlcvs")
            .createTable(tableName, function (table) {
              table.timestamp("time", { useTz: true }).primary();
              table.double("open");
              table.double("high");
              table.double("low");
              table.double("close");
              table.double("volume");
              table.integer("trades");
              table.double("taker_volume");
            });
          await db.raw(
            `CREATE INDEX ${tableName}_index  ON ohlcvs.${tableName} USING btree (time DESC)`
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  console.log(coins);
})();
