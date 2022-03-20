import axios from "axios";

import db from "../src/database/index";

const updateExchangeSymbols = async () => {
  const res = await axios("https://api.binance.com/api/v3/exchangeInfo");
  const symbols = await Promise.all(
    res.data.symbols
      .filter(
        (symbol) =>
          symbol.quoteAsset === "USDT" &&
          symbol.isSpotTradingAllowed &&
          symbol.status === "TRADING"
      )
      .map(async (s) => {
        delete s.quotePrecision;
        delete s.baseCommissionPrecision;
        delete s.quoteCommissionPrecision;
        delete s.ocoAllowed;
        delete s.icebergAllowed;
        delete s.quoteOrderQtyMarketAllowed;
        delete s.isSpotTradingAllowed;
        delete s.isMarginTradingAllowed;
        delete s.status;
        delete s.permissions;
        delete s.orderTypes;
        const filters = {};
        s.filters.forEach((filter) => {
          const { filterType } = filter;
          delete filter.filterType;
          filters[filterType] = filter;
        });
        s.filters = filters;
        return s;
      })
  );

  const list = new Set();

  for (let i = 0; i < symbols.length; i++) {
    if (!list.has(symbols[i].baseAsset)) {
      list.add(symbols[i].baseAsset);
    }
  }
  const coins = await db("coins")
    .select(["id", "symbol"])
    .whereIn("symbol", [...list]);
  const result = symbols.map((symbol) => ({
    ...symbol,
    id: coins.find((coin) => coin.symbol === symbol.baseAsset)?.id,
  }));
  console.log(symbols.length, result.length);

  await db("binance_trading_pairs").insert(result).onConflict("symbol").merge();
};

export default updateExchangeSymbols;
