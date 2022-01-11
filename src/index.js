import schedule from "node-schedule";

import db from "./database";
import updateBinanceOHLCVs from "./updateBinanceOHLCVs";
import updateCoinmarketSymbols from "./updateCoinmarketSymbols";
import updateExchangeSymbols from "./updateExchangeSymbols";

let symbols;
(async () => {
  // await updateCoinmarketSymbols();
  // await updateExchangeSymbols();
  // while (true) {
  //   await updateBinanceOHLCVs(symbols);
  // }
})();

schedule.scheduleJob("2 * * * * *", async () => {
  symbols && (await updateBinanceOHLCVs());
});

// schedule.scheduleJob("* * 0 * * *", async () => {
//   await updateCoinmarketSymbols();
//   await updateExchangeSymbols();
// });
