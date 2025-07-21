const { sendTelegramAlert } = require('./sendTelegramAlert');
const logger = require('./logger');

// Exemplo simplificado de padrão candle: martelo, engulfing etc (pode expandir)
function isBullishReversal(candle, prevCandle) {
  // Exemplo básico
  return candle.close > candle.open && candle.close > prevCandle.close;
}

function isBearishReversal(candle, prevCandle) {
  return candle.close < candle.open && candle.close < prevCandle.close;
}

async function analyzeAndAlert(symbol, timeframe, candles, pivots, levels, chatId) {
  if (!candles.length) return false;

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];

  // Check volume high relative to average (last 20 candles)
  const avgVolume = candles.slice(-21, -1).reduce((a, c) => a + c.volume, 0) / 20;
  const volumeSpike = lastCandle.volume > avgVolume * 1.5;

  // Confirm reteste de suporte/resistência + volume forte + padrão reversal
  // Exemplo: último close próximo de suporte/resistência

  let alertMessage = null;

  // Confirma se preço rompeu níveis pivô
  if (lastCandle.close > pivots.R1 && volumeSpike && isBullishReversal(lastCandle, prevCandle)) {
    alertMessage = `🚀 *Compra* detectada\n📊 ${symbol} (${timeframe})\n🟢 Rompimento acima de R1 (${pivots.R1}) com volume alto e padrão bullish.`;
  } else if (lastCandle.close < pivots.S1 && volumeSpike && isBearishReversal(lastCandle, prevCandle)) {
    alertMessage = `📉 *Venda* detectada\n📊 ${symbol} (${timeframe})\n🔴 Rompimento abaixo de S1 (${pivots.S1}) com volume alto e padrão bearish.`;
  }

  if (alertMessage) {
    await sendTelegramAlert(chatId, alert
