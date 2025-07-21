const { getCandles } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { detectLevels } = require('./levels');
const { calculateFibonacciLevels, isNearFiboLevel } = require('./fibonacci');
const { analyzeAndAlert } = require('./alerts');
const { log } = require('./logger');

const timeframes = ['1h', '4h', '1d'];

async function monitorSymbol(symbol, chatId) {
  for (const tf of timeframes) {
    try {
      const candles = await getCandles(symbol, tf);
      const pivot = calculatePivotLevels(candles);
      const fibo = calculateFibonacciLevels(candles);
      const levels = detectLevels(candles);
      await analyzeAndAlert(symbol, tf, candles, { pivot, fibo, levels }, chatId);
    } catch (err) {
      log(`[Monitor][${symbol}][${tf}] Erro: ${err.message}`);
    }
  }
}

async function monitorAllTimeframes(chatId, symbols) {
  log(`[Monitor] Symbols to monitor: ${symbols.join(', ')}`);
  for (const symbol of symbols) {
    await monitorSymbol(symbol, chatId);
  }
}

module.exports = { monitorAllTimeframes };
