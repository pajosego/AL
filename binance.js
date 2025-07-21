const axios = require('axios');

const binanceSymbolMap = {
  BTCUSD: 'BTCUSDT',
  ETHUSD: 'ETHUSDT',
  BCHUSD: 'BCHUSDT',
  XRPUSD: 'XRPUSDT',
  LTCUSD: 'LTCUSDT',
};

async function getCandles(symbol, interval = '1h', limit = 100) {
  const binanceSymbol = binanceSymbolMap[symbol] || symbol;

  const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`;

  try {
    const res = await axios.get(url);
    return res.data.map(c => ({
      datetime: new Date(c[0]).toISOString(),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
      volume: parseFloat(c[5]),
    }));
  } catch (err) {
    throw new Error(`Falha ao buscar candles Binance para ${symbol}: ${err.message}`);
  }
}

module.exports = { getCandles };
