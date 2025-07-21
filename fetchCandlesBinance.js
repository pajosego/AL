// fetchCandlesBinance.js
const axios = require('axios');

const binanceSymbolMap = {
  BTCUSD: 'BTCUSDT',
  ETHUSD: 'ETHUSDT',
  BCHUSD: 'BCHUSDT',
  XRPUSD: 'XRPUSDT',
  LTCUSD: 'LTCUSDT',
};

const timeframeMap = {
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

async function fetchCandlesBinance(symbol, timeframe) {
  const binanceSymbol = binanceSymbolMap[symbol];
  if (!binanceSymbol) throw new Error(`Símbolo Binance não mapeado: ${symbol}`);

  const interval = timeframeMap[timeframe];
  if (!interval) throw new Error(`Timeframe inválido para Binance: ${timeframe}`);

  const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=100`;

  const res = await axios.get(url);

  return res.data.map(c => ({
    datetime: new Date(c[0]).toISOString(),
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5]),
  }));
}

module.exports = { fetchCandlesBinance };
