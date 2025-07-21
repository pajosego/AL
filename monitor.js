const { getCandles, getTopVolatileSymbols } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { analyzeAndAlert } = require('./alerts');

const TIMEFRAMES = ['1d', '4h', '1h'];

async function monitorSymbolInTimeframe(symbol, timeframe, chatId) {
  try {
    const candles = await getCandles(symbol, timeframe);
    const pivots = calculatePivotLevels(candles);
    await analyzeAndAlert(symbol, timeframe, candles, pivots, chatId);
  } catch (err) {
    console.error(`[Monitor] Erro no monitoramento de ${symbol} ${timeframe}:`, err.message);
  }
}

async function monitorAllTimeframes(chatId) {
  try {
    const symbols = await getTopVolatileSymbols();
    console.log(`[Monitor] Symbols to monitor: ${symbols.join(', ')}`);

    for (const symbol of symbols) {
      for (const timeframe of TIMEFRAMES) {
        await monitorSymbolInTimeframe(symbol, timeframe, chatId);
      }
    }
  } catch (e) {
    console.error('[Monitor] Erro geral no monitor:', e.message);
  }
}

module.exports = { monitorAllTimeframes };
