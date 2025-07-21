const { sendTelegramAlert } = require('./telegram');
const { isNearFiboLevel, calculateFibonacciLevels } = require('./fibonacci');

const ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hora
const DAILY_LIMIT = 100;

const alertLog = new Map(); // `${symbol}_${type}` → timestamp
const alertCountByDay = new Map(); // YYYY-MM-DD → count

function resetDailyCount() {
  const today = new Date().toISOString().slice(0, 10);
  for (const day of alertCountByDay.keys()) {
    if (day !== today) alertCountByDay.delete(day);
  }
}

function canSendAlert(symbol, type) {
  resetDailyCount();
  const now = Date.now();
  const key = `${symbol}_${type}`;
  const today = new Date().toISOString().slice(0, 10);
  let count = alertCountByDay.get(today) || 0;

  if (count >= DAILY_LIMIT) return false;

  if (!alertLog.has(key) || now - alertLog.get(key) > ALERT_COOLDOWN) {
    alertLog.set(key, now);
    alertCountByDay.set(today, count + 1);
    return true;
  }
  return false;
}

function isStrongCandle(candle) {
  const body = Math.abs(candle.close - candle.open);
  const range = candle.high - candle.low;
  return range !== 0 && body / range > 0.6;
}

function isHighVolume(candle, avgVolume) {
  return candle.volume > avgVolume * 1.2;
}

function formatAlertMessage(symbol, type, entry, sl, tp, time) {
  const emoji = type === 'compra' ? '🚀' : '🛑';
  return `${emoji} ${type.toUpperCase()} confirmada para ${symbol}!\n` +
         `Entrada: ${entry.toFixed(6)}\n` +
         `Stop Loss: ${sl.toFixed(6)}\n` +
         `Take Profit: ${tp.toFixed(6)}\n` +
         `Horário (UTC): ${time}`;
}

async function analyzeAndAlert(symbol, timeframe, candles, pivots, chatId) {
  if (!pivots) return;

  const last = candles.at(-1);
  const prev = candles.at(-2);
  if (!last || !prev) return;

  const volumes = candles.map(c => c.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

  const fibLevels = calculateFibonacciLevels(pivots.R2, pivots.S2);

  // Confirma que a vela rompeu pivots e está perto de níveis fibonacci
  if (
    prev.close <= pivots.R1 &&
    last.close > pivots.R1 &&
    isStrongCandle(last) &&
    isHighVolume(last, avgVolume) &&
    isNearFiboLevel(last.close, fibLevels)
  ) {
    const dist = Math.abs(last.close - pivots.R1) / pivots.R1;
    if (dist <= 0.002) {
      const entry = last.close;
      const sl = pivots.pivot;
      const risk = entry - sl;
      const tp = entry + 3 * risk;

      if (canSendAlert(symbol, 'compra')) {
        const time = new Date().toISOString();
        const msg = formatAlertMessage(symbol, 'compra', entry, sl, tp, time);
        await sendTelegramAlert(chatId, msg);
        console.log(`[${time}] ALERTA COMPRA enviado para ${symbol} no timeframe ${timeframe}`);
      }
    }
  }

  if (
    prev.close >= pivots.S1 &&
    last.close < pivots.S1 &&
    isStrongCandle(last) &&
    isHighVolume(last, avgVolume) &&
    isNearFiboLevel(last.close, fibLevels)
  ) {
    const dist = Math.abs(last.close - pivots.S1) / pivots.S1;
    if (dist <= 0.002) {
      const entry = last.close;
      const sl = pivots.pivot;
      const risk = sl - entry;
      const tp = entry - 3 * risk;

      if (canSendAlert(symbol, 'venda')) {
        const time = new Date().toISOString();
        const msg = formatAlertMessage(symbol, 'venda', entry, sl, tp, time);
        await sendTelegramAlert(chatId, msg);
        console.log(`[${time}] ALERTA VENDA enviado para ${symbol} no timeframe ${timeframe}`);
      }
    }
  }
}

module.exports = { analyzeAndAlert };
