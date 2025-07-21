// fetchCandles.js
const { fetchCandlesBinance } = require('./fetchCandlesBinance');
const { fetchCandlesTwelve } = require('./fetchCandlesTwelve');

const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD'];

function isCrypto(symbol) {
  return cryptoSymbols.includes(symbol);
}

async function fetchCandles(symbol, timeframe = '1h') {
  if (isCrypto(symbol)) {
    return fetchCandlesBinance(symbol, timeframe);
  }
  return fetchCandlesTwelve(symbol, timeframe);
}

module.exports = { fetchCandles, isCrypto };
