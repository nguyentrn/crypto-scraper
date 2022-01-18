import schedule from "node-schedule";

import db from "./database";
import updateBinanceOHLCVs from "./updateBinanceOHLCVs";
import updateCoinmarketSymbols from "./updateCoinmarketSymbols";
import updateExchangeSymbols from "./updateExchangeSymbols";

(async () => {
  // await updateCoinmarketSymbols();
  // await updateExchangeSymbols();
  while (true) {
    await updateBinanceOHLCVs("1m");
  }
})();

schedule.scheduleJob("2 * * * * *", async () => {
  // symbols && (await updateBinanceOHLCVs());
});

// schedule.scheduleJob("* * 0 * * *", async () => {
//   await updateCoinmarketSymbols();
//   await updateExchangeSymbols();
// });
