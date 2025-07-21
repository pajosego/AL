const { fetchCandles } = require('./fetchCandles');
const { analyzeAndAlert } = require('./alerts');
const { calculatePivots } = require('./supportResistance');

const TIMEFRAMES = ['1h', '4h', '1d'];

async function monitorAllTimeframes(chatId, symbols) {
  for (const symbol of symbols) {
    for (const timeframe of TIMEFRAMES) {
      try {
        const candles = await fetchCandles(symbol, timeframe);
        const pivots = calculatePivots(candles);
        await analyzeAndAlert(symbol, timeframe, candles, pivots, chatId);
      } catch (error) {
        console.error(`[Monitor] Erro ao monitorar ${symbol} (${timeframe}): ${error.message}`);
      }
    }
  }
}

module.exports = { monitorAllTimeframes };
