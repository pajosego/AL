const axios = require('axios');

async function getCandles(symbol, interval = '5m', limit = 200) {
  // Mapeamento básico para pares binance (adaptar conforme necessidade)
  const binanceSymbolMap = {
    BTCUSD: 'BTCUSDT',
    ETHUSD: 'ETHUSDT',
    BCHUSD: 'BCHUSDT',
    XRPUSD: 'XRPUSDT',
    LTCUSD: 'LTCUSDT',
  };

  const binanceSymbol = binanceSymbolMap[symbol] || symbol;

  const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`;

  try {
    const res = await axios.get(url);
    return res.data.map(c => ({
      openTime: c[0],
      open: +c[1],
      high: +c[2],
      low: +c[3],
      close: +c[4],
      volume: +c[5],
      closeTime: c[6],
    }));
  } catch (err) {
    throw new Error(`Falha ao buscar candles Binance para ${symbol}: ${err.message}`);
  }
}

module.exports = { getCandles };
