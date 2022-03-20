import axios from "axios";
import fs from "fs";
import db from "./database";

const download = async (url, filename) => {
  const writer = fs.createWriteStream(filename);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);
  const w = response.data.pipe(fs.createWriteStream(filename));
  w.on("finish", () => {
    // console.log("Successfully downloaded file!");
  });
  return w;
};

const downloadTokenLogos = async () => {
  const tokens = await db("binance_trading_pairs")
    .select("*")
    .whereNotNull("id");
  tokens.push({ id: 825, baseAsset: "USDT" });

  for (let i = 0; i < tokens.length; i++) {
    try {
      download(
        `https://s2.coinmarketcap.com/static/img/coins/128x128/${tokens[i].id}.png`,
        `imgs/${tokens[i].baseAsset}.png`,
        function () {
          console.log(`${tokens[i].baseAsset}.png`);
        }
      );
    } catch (err) {}
  }

  console.log(tokens.length);
};

export default downloadTokenLogos;
