import schedule from "node-schedule";
import create10mOHLCVsFrom1m from "./create10mOHLCVsFrom1m";

import db from "./database";
import updateBinanceOHLCVs from "./updateBinanceOHLCVs";
import updateCoinmarketSymbols from "./updateCoinmarketSymbols";
import updateExchangeSymbols from "./updateExchangeSymbols";

(async () => {
  // await create10mOHLCVsFrom1m();
  // await updateCoinmarketSymbols();
  // await updateExchangeSymbols();
  // while (true) {
  //   await updateBinanceOHLCVs("1m");
  // }
})();

schedule.scheduleJob("*/5 * * * * *", async () => {
  await updateBinanceOHLCVs("1m");
});

// schedule.scheduleJob("* * 0 * * *", async () => {
//   await updateCoinmarketSymbols();
//   await updateExchangeSymbols();
// });
