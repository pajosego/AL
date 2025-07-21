// dataProviders.js
const axios = require('axios');

const TWELVE_API_KEY = process.env.TWELVE_API_KEY;

const symbolSourceMap = {
  // Criptos -> Binance
  BTCUSD: 'binance',
  ETHUSD: 'binance',
  BCHUSD: 'binance',
  XRPUSD: 'binance',
  LTCUSD: 'binance',

  // Forex, Índices, Ações -> Twelve Data
  EURUSD: 'twelve',
  USDJPY: 'twelve',
  GBPUSD: 'twelve',
  AUDUSD: 'twelve',
  USDCAD: 'twelve',
  US500: 'twelve',
  US100: 'twelve',
  US30: 'twelve',
  DE30: 'twelve',
  UK100: 'twelve',
  'AAPL.US': 'twelve',
  'TSLA.US': 'twelve',
  'JPM.US': 'twelve',
  'MC.FR': 'twelve',
  'SHEL.US': 'twelve'
};

// Função principal que retorna candles históricos
async function getCandles(symbol, timeframe = '1h', limit = 100) {
  const source = symbolSourceMap[symbol];
  if (source === 'binance') return getCandlesFromBinance(symbol, timeframe, limit);
  if (source === 'twelve') return getCandlesFromTwelve(symbol, timeframe, limit);
  throw new Error(`Fonte de dados desconhecida para o símbolo: ${symbol}`);
}

// Adaptar timeframes para APIs
function mapTimeframe(tf) {
  return {
    '1h': '1h',
    '4h': '4h',
    '1d': '1day'
  }[tf];
}

async function getCandlesFromBinance(symbol, timeframe, limit) {
  const mappedSymbol = symbol.replace('USD', 'USDT');
  const url = `https://api.binance.com/api/v3/klines?symbol=${mappedSymbol}&interval=${timeframe}&limit=${limit}`;
  const { data } = await axios.get(url);
  return data.map(c => ({
    time: c[0],
    open: +c[1],
    high: +c[2],
    low: +c[3],
    close: +c[4],
    volume: +c[5]
  }));
}

async function getCandlesFromTwelve(symbol, timeframe, limit) {
  const interval = mapTimeframe(timeframe);
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${limit}&apikey=${TWELVE_API_KEY}`;
  const { data } = await axios.get(url);

  if (data.status === 'error') throw new Error(data.message);

  return data.values.reverse().map(c => ({
    time: new Date(c.datetime).getTime(),
    open: +c.open,
    high: +c.high,
    low: +c.low,
    close: +c.close,
    volume: +c.volume
  }));
}

module.exports = { getCandles };
