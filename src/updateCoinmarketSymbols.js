import axios from 'axios';

import db from '../src/database/index';

const updateCoinmarketSymbols = async () => {
  const res = await axios(
    'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=70000&sortBy=market_cap&sortType=desc&cryptoType=all&tagType=all&audited=false&aux=cmc_rank,num_market_pairs',
  );
  const coins = res.data.data.cryptoCurrencyList.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    rank: coin.cmcRank,
    marketPairCount: coin.marketPairCount,
    updatedAt: new Date(),
  }));
  await db('coins').insert(coins).onConflict('id').merge();
};

export default updateCoinmarketSymbols;
