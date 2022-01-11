import schedule from "node-schedule";

import db from "./database";
import updateBinanceOHLCVs from "./updateBinanceOHLCVs";
import updateCoinmarketSymbols from "./updateCoinmarketSymbols";
import updateExchangeSymbols from "./updateExchangeSymbols";

let symbols;
(async () => {
  // await updateCoinmarketSymbols();
  // await updateExchangeSymbols();
  symbols = await db
    .with(
      "last",
      db("ohlcvs").select(db.raw("symbol, max(time)")).groupBy("symbol")
    )
    .from("binance_trading_pairs")
    .join("coins", "binance_trading_pairs.baseAsset", "coins.symbol")
    .join("last", "binance_trading_pairs.symbol", "last.symbol")
    .select(["binance_trading_pairs.symbol", "last.max"])
    .where("rank", "<", 1000)
    // .where("max", "<", new Date("2022-01-09T22:39:00.000Z"))
    .orderBy("rank")
    .limit(36);

  // while (true) {
  // await updateBinanceOHLCVs(symbols);
  // }
})();

schedule.scheduleJob("2 * * * * *", async () => {
  // for (let i = 0; i < symbols.length; i++) {
  symbols && (await updateBinanceOHLCVs(symbols));
  // }
});

// schedule.scheduleJob("* * 0 * * *", async () => {
//   await updateCoinmarketSymbols();
//   await updateExchangeSymbols();
// });
