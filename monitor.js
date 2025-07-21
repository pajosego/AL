const { fetchCandlesTwelve } = require('./fetchCandlesTwelve');
const { fetchCandlesBinance } = require('./fetchCandlesBinance');
const { analyzeAndAlert } = require('./alerts');
const { calculatePivots } = require('./supportResistance');

const TIMEFRAMES = ['1h', '4h', '1d'];

// Símbolos cripto para buscar na Binance
const CRYPTO_SYMBOLS = ['BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD'];

async function monitorAllTimeframes(chatId, symbols) {
  for (const symbol of symbols) {
    for (const timeframe of TIMEFRAMES) {
      try {
        let candles;

        if (CRYPTO_SYMBOLS.includes(symbol)) {
          candles = await fetchCandlesBinance(symbol, timeframe);
        } else {
          candles = await fetchCandlesTwelve(symbol, timeframe);
        }

        const pivots = calculatePivots(candles);
        await analyzeAndAlert(symbol, timeframe, candles, pivots, chatId);
      } catch (error) {
        console.error(`[Monitor] Erro ao monitorar ${symbol} (${timeframe}): ${error.message}`);
      }
    }
  }
}

module.exports = { monitorAllTimeframes };
