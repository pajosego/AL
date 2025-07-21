const { getTopVolatileSymbols, getCandles } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { analyzeAndAlert } = require('./alerts');
const { calculateFibonacciLevels, isNearFiboLevel } = require('./fibonacci');

const TIMEFRAMES = ['1d', '4h', '1h'];
const MAX_SYMBOLS = 10;

async function monitorAllTimeframes(chatId) {
  try {
    const symbols = await getTopVolatileSymbols(MAX_SYMBOLS);
    console.log('[Monitor] Symbols to monitor:', symbols.join(', '));

    for (const symbol of symbols) {
      const candlesByTf = {};
      for (const tf of TIMEFRAMES) {
        const candles = await getCandles(symbol, tf);
        candlesByTf[tf] = candles;
      }
      // 4h pivot + fibo
      const pivots4h = calculatePivotLevels(candlesByTf['4h']);
      const fiboLevels = calculateFibonacciLevels(candlesByTf['4h']);

      await analyzeAndAlert(symbol, candlesByTf, pivots4h, fiboLevels, chatId);
    }
  } catch (err) {
    console.error('[Monitor] Erro:', err.message);
  }
}

module.exports = { monitorAllTimeframes };