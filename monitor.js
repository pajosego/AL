const { getCandles } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { analyzeAndAlert } = require('./alerts');

const symbol = 'MATICUSDT';
const timeframe = '5m';
const chatId = 'SEU_CHAT_ID'; // coloque seu chatId real aqui

async function monitor() {
  try {
    const candles = await getCandles(symbol, timeframe);
    const pivots = calculatePivotLevels(candles);
    await analyzeAndAlert(symbol, timeframe, candles, pivots, chatId);
  } catch (err) {
    console.error('Erro no monitor:', err.message);
  }
}

setInterval(monitor, 60 * 1000); // Executa a cada minuto
