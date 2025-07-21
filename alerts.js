const { sendTelegramAlert } = require('./telegram');

const ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hora
const DAILY_LIMIT = 100;

const alertLog = new Map();
const alertCountByDay = new Map();

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
  return `${emoji} ${type.toUpperCase()} confirmada para ${symbol}!
` +
         `Entrada: ${entry.toFixed(6)}
` +
         `Stop Loss: ${sl.toFixed(6)}
` +
         `Take Profit: ${tp.toFixed(6)}
` +
         `Horário (UTC): ${time}`;
}

async function analyzeAndAlert(symbol, candlesByTf, pivots4h, fiboLevels, chatId) {
  if (!pivots4h) return;

  const candles4h = candlesByTf['4h'];
  const candles1h = candlesByTf['1h'];
  const candles1d = candlesByTf['1d'];

  const last4h = candles4h.at(-1);
  const prev4h = candles4h.at(-2);
  if (!last4h || !prev4h) return;

  const volumes = candles4h.map(c => c.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

  // Compra
  if (prev4h.close <= pivots4h.R1 && last4h.close > pivots4h.R1 &&
      isStrongCandle(last4h) && isHighVolume(last4h, avgVolume) &&
      isNearFiboLevel(last4h.close, fiboLevels)) {
    const dist = Math.abs(last4h.close - pivots4h.R1) / pivots4h.R1;
    if (dist <= 0.002) {
      const entry = last4h.close;
      const sl = pivots4h.pivot;
      const risk = entry - sl;
      const tp = entry + 3 * risk;
      if (canSendAlert(symbol, 'compra')) {
        const time = new Date().toISOString();
        const msg = formatAlertMessage(symbol, 'compra', entry, sl, tp, time);
        await sendTelegramAlert(chatId, msg);
        console.log(`[${time}] ALERTA COMPRA enviado para ${symbol} (Volume: ${last4h.volume}, Candlestick forte, Próximo Fibonacci)`);
      }
    }
  }

  // Venda
  if (prev4h.close >= pivots4h.S1 && last4h.close < pivots4h.S1 &&
      isStrongCandle(last4h) && isHighVolume(last4h, avgVolume) &&
      isNearFiboLevel(last4h.close, fiboLevels)) {
    const dist = Math.abs(last4h.close - pivots4h.S1) / pivots4h.S1;
    if (dist <= 0.002) {
      const entry = last4h.close;
      const sl = pivots4h.pivot;
      const risk = sl - entry;
      const tp = entry - 3 * risk;
      if (canSendAlert(symbol, 'venda')) {
        const time = new Date().toISOString();
        const msg = formatAlertMessage(symbol, 'venda', entry, sl, tp, time);
        await sendTelegramAlert(chatId, msg);
        console.log(`[${time}] ALERTA VENDA enviado para ${symbol} (Volume: ${last4h.volume}, Candlestick forte, Próximo Fibonacci)`);
      }
    }
  }
}

module.exports = { analyzeAndAlert };