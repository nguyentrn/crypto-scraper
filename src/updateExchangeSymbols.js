import axios from 'axios';

import db from '../src/database/index';

const updateExchangeSymbols = async () => {
  const res = await axios('https://api.binance.com/api/v3/exchangeInfo');
  const symbols = res.data.symbols
    .filter(
      (symbol) =>
        symbol.quoteAsset === 'USDT' &&
        symbol.isSpotTradingAllowed &&
        symbol.status === 'TRADING',
    )
    .map((s) => {
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
    });
  await db('binance_trading_pairs')
    .insert(symbols)
    .onConflict('symbol')
    .merge();
};

export default updateExchangeSymbols;
