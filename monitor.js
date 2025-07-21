const { fetchCandles, isCrypto } = require('./fetchCandles');
const { calculatePivots } = require('./supportResistance');
const { calculateATR } = require('./atr');
const { sendAlert } = require('./alerts');
const { getCache, setCache } = require('./cache');
const { wasAlertSent, markAlertSent } = require('./alertCache');

const TIMEFRAMES = ['1h', '4h', '1d'];

const VOLUME_MULTIPLIER = parseFloat(process.env.VOLUME_MULTIPLIER) || 1.5;
const ATR_STOP_MULTIPLIER = parseFloat(process.env.ATR_STOP_MULTIPLIER) || 1.5;
const ATR_TAKE_MULTIPLIER = parseFloat(process.env.ATR_TAKE_MULTIPLIER) || 3;

async function withRetry(fn, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function getCachedCandles(symbol, timeframe) {
  const key = `${symbol}_${timeframe}`;
  let candles = getCache(key);
  if (candles) return candles;

  candles = await withRetry(() => fetchCandles(symbol, timeframe));
  setCache(key, candles);
  return candles;
}

function log(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

async function monitorAllTimeframes(chatId, symbols) {
  await Promise.all(symbols.map(symbol =>
    Promise.all(TIMEFRAMES.map(async timeframe => {
      try {
        const candles = await getCachedCandles(symbol, timeframe);

        if (!candles || candles.length === 0) {
          log('WARN', `[Monitor] Sem candles para ${symbol} (${timeframe})`);
          return;
        }

        const pivots = calculatePivots(candles);
        const atr = calculateATR(candles);

        if (!atr) {
          log('WARN', `[Monitor] ATR insuficiente para ${symbol} (${timeframe})`);
          return;
        }

        const lastCandle = candles[candles.length - 1];
        const avgVolume = candles.reduce((acc, c) => acc + c.volume, 0) / candles.length;
        const strongVolume = lastCandle.volume > avgVolume * VOLUME_MULTIPLIER;

        // Rompimento resistência
        if (lastCandle.close > pivots.resistance && strongVolume) {
          const alertKey = `${symbol}_${timeframe}_resistance`;
          if (!wasAlertSent(alertKey)) {
            const entry = lastCandle.close;
            const stopLoss = entry - atr * ATR_STOP_MULTIPLIER;
            const takeProfit = entry + atr * ATR_TAKE_MULTIPLIER;

            const message =
              `📈 *${symbol}* (${timeframe}) rompimento de *resistência* confirmado!\n` +
              `Entrada: ${entry.toFixed(4)}\n` +
              `Stop Loss: ${stopLoss.toFixed(4)}\n` +
              `Take Profit: ${takeProfit.toFixed(4)}\n` +
              `Volume: Forte (${lastCandle.volume.toFixed(0)})`;

            await sendAlert(message);
            markAlertSent(alertKey);
          }
        }
        // Rompimento suporte
        else if (lastCandle.close < pivots.support && strongVolume) {
          const alertKey = `${symbol}_${timeframe}_support`;
          if (!wasAlertSent(alertKey)) {
            const entry = lastCandle.close;
            const stopLoss = entry + atr * ATR_STOP_MULTIPLIER;
            const takeProfit = entry - atr * ATR_TAKE_MULTIPLIER;

            const message =
              `📉 *${symbol}* (${timeframe}) rompimento de *suporte* confirmado!\n` +
              `Entrada: ${entry.toFixed(4)}\n` +
              `Stop Loss: ${stopLoss.toFixed(4)}\n` +
              `Take Profit: ${takeProfit.toFixed(4)}\n` +
              `Volume: Forte (${lastCandle.volume.toFixed(0)})`;

            await sendAlert(message);
            markAlertSent(alertKey);
          }
        } else {
          log('INFO', `[Monitor] ${symbol} (${timeframe}) sem rompimento confirmado.`);
        }
      } catch (err) {
        log('ERROR', `[Monitor] Erro ao monitorar ${symbol} (${timeframe}): ${err.message}`);
      }
    }))
  ));
}

module.exports = { monitorAllTimeframes };
