import fs from "fs";
import request from "request";
const ColorThief = require("colorthief");

import db from "./database";

const rgbToHex = (colors) =>
  "#" +
  colors
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

const setTokenColors = async () => {
  const tokens = await db("binance_trading_pairs")
    .select("*")
    .whereNotNull("id");
  tokens.push({ id: 825, baseAsset: "USDT" });

  const coins = [];
  for (let i = 0; i < tokens.length; i++) {
    try {
      const res = await ColorThief.getColor(`imgs/${tokens[i].baseAsset}.png`);

      const coin = {};
      coin.id = tokens[i].id;
      coin.color = rgbToHex(res);
      coin.symbol = tokens[i].baseAsset;
      coins.push(coin);
    } catch (err) {
      console.log(err);
    }
  }
  await db("coins").insert(coins).onConflict("id").merge();
  console.log(tokens.length, coins.length);
};

export default setTokenColors;
