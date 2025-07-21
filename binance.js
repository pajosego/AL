const axios = require('axios');

const BASE_URL = 'https://api.binance.com/api/v3/klines';

const TIMEFRAME_MAP = {
  '1h': '1h',
  '4h': '4h',
  '1d': '1d'
};

async function getCandles(symbol, interval = '1h', limit = 100) {
  const binanceSymbol = symbol.replace('USD', 'USDT').replace('.US', '').replace('.FR', '');
  const url = `${BASE_URL}?symbol=${binanceSymbol}&interval=${TIMEFRAME_MAP[interval] || interval}&limit=${limit}`;
  const res = await axios.get(url);

  return res.data.map(c => ({
    openTime: c[0],
    open: +c[1],
    high: +c[2],
    low: +c[3],
    close: +c[4],
    volume: +c[5],
    closeTime: c[6]
  }));
}

module.exports = { getCandles };
