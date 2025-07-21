const axios = require('axios');
const API_KEY = process.env.TWELVE_API_KEY;

const binanceSymbolMap = {
  BTCUSD: 'BTCUSDT',
  ETHUSD: 'ETHUSDT',
  BCHUSD: 'BCHUSDT',
  XRPUSD: 'XRPUSDT',
  LTCUSD: 'LTCUSDT',
};

const timeframeMapBinance = {
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

async function fetchCandlesBinance(symbol, timeframe) {
  const binanceSymbol = binanceSymbolMap[symbol];
  if (!binanceSymbol) throw new Error(`Símbolo Binance não mapeado: ${symbol}`);

  const interval = timeframeMapBinance[timeframe];
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

async function fetchCandlesTwelve(symbol, timeframe) {
  // Ajusta símbolos para Twelve (ex: AAPL.US -> AAPL/US)
  const formattedSymbol = symbol.includes('.') ? symbol.replace('.', '/') : symbol;

  const url = `https://api.twelvedata.com/time_series?symbol=${formattedSymbol}&interval=${timeframe}&apikey=${API_KEY}&format=json&outputsize=100`;

  const response = await axios.get(url);
  if (response.data && response.data.values) {
    return response.data.values.reverse().map(candle => ({
      datetime: candle.datetime,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume),
    }));
  } else {
    throw new Error('Dados inválidos recebidos da API Twelve Data');
  }
}

async function fetchCandles(symbol, timeframe = '1h') {
  const cryptoSymbols = Object.keys(binanceSymbolMap);
  if (cryptoSymbols.includes(symbol)) {
    return fetchCandlesBinance(symbol, timeframe);
  } else {
    return fetchCandlesTwelve(symbol, timeframe);
  }
}

module.exports = { fetchCandles };
