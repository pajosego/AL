const axios = require('axios');

async function getCandles(symbol, interval = '5m', limit = 100) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
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

async function getTopVolatileSymbols(limit = 10) {
  // Obtém 24h ticker price change statistics
  const url = 'https://api.binance.com/api/v3/ticker/24hr';
  const res = await axios.get(url);
  const symbols = res.data
    .filter(s => s.symbol.endsWith('USDT') && !s.symbol.includes('UP') && !s.symbol.includes('DOWN'))
    .map(s => ({
      symbol: s.symbol,
      priceChangePercent: parseFloat(s.priceChangePercent)
    }))
    .sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
    .slice(0, limit)
    .map(s => s.symbol);
  return symbols;
}

module.exports = { getCandles, getTopVolatileSymbols };