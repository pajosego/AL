const { getCandles } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { analyzeAndAlert } = require('./alerts');

const symbol = 'MATICUSDT';
const timeframe = '5m';

async function monitor(chatId) {
  try {
    const candles = await getCandles(symbol, timeframe);
    const pivots = calculatePivotLevels(candles);
    await analyzeAndAlert(symbol, timeframe, candles, pivots, chatId);
  } catch (err) {
    console.error('Erro no monitor:', err.message);
  }
}

module.exports = { monitor };
