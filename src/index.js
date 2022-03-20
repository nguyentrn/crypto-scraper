import schedule from "node-schedule";
import createOHLCVsFrom1m from "./createOHLCVsFrom1m";

import db from "./database";
import downloadTokenLogos from "./downloadTokenLogo";
import setTokenColors from "./setTokenColors";
import updateBinanceOHLCVs from "./updateBinanceOHLCVs";
import updateCoinmarketSymbols from "./updateCoinmarketSymbols";
import updateExchangeSymbols from "./updateExchangeSymbols";

(async () => {
  // await updateCoinmarketSymbols();
  // await updateExchangeSymbols();
  // await createOHLCVsFrom1m();
  // await downloadTokenLogos();
  // await setTokenColors();
  // while (true) {
  //   await updateBinanceOHLCVs("1m");
  // }
  // await updateBinanceOHLCVs("1m");

  console.log("done");
})();

schedule.scheduleJob("3 * * * * *", async () => {
  await updateBinanceOHLCVs("1m");
});

// schedule.scheduleJob("* * 0 * * *", async () => {
//   await updateCoinmarketSymbols();
//   await updateExchangeSymbols();
// });
