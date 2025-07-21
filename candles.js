const { fetchCandlesBinance } = require('./fetchCandlesBinance');
const { fetchCandlesTwelve } = require('./fetchCandlesTwelve');

const binanceSymbolMap = {
  BTCUSD: 'BTCUSDT',
  ETHUSD: 'ETHUSDT',
  BCHUSD: 'BCHUSDT',
  XRPUSD: 'XRPUSDT',
  LTCUSD: 'LTCUSDT',
};

async function fetchCandles(symbol, timeframe = '1h') {
  if (binanceSymbolMap[symbol]) {
    return fetchCandlesBinance(symbol, timeframe);
  } else {
    return fetchCandlesTwelve(symbol, timeframe);
  }
}

module.exports = { fetchCandles };
