const { calculateATR } = require('./calculateATR');

async function analyzeAndAlert(symbol, timeframe, candles, pivots, chatId) {
  // ATR
  let atr;
  try {
    atr = calculateATR(candles);
  } catch {
    console.log(`[Alert] ATR não calculado para ${symbol} ${timeframe} (candles insuficientes)`);
    return;
  }

  const lastCandle = candles[candles.length - 1];
  const close = lastCandle.close;

  // Detecta rompimento confirmado: candle fechou acima da resistência ou abaixo do suporte
  const resistance = pivots.resistance;
  const support = pivots.support;

  let direction = null;
  let entry, stopLoss, takeProfit;

  if (close > resistance) {
    direction = 'breakout_up';
    entry = close;
    stopLoss = entry - 1.5 * atr;
    takeProfit = entry + 3 * atr;
  } else if (close < support) {
    direction = 'breakout_down';
    entry = close;
    stopLoss = entry + 1.5 * atr;
    takeProfit = entry - 3 * atr;
  } else {
    // Sem rompimento confirmado
    return;
  }

  // Formatar números com 4 casas decimais (ou adaptar)
  const formatPrice = (p) => p.toFixed(4);

  const emoji = direction === 'breakout_up' ? '📈' : '📉';
  const breakoutType = direction === 'breakout_up' ? 'resistência' : 'suporte';

  const message = `
${emoji} ${symbol} (${timeframe}) rompimento confirmado de ${breakoutType}!
Entrada: ${formatPrice(entry)}
Stop Loss: ${formatPrice(stopLoss)}
Take Profit: ${formatPrice(takeProfit)}
Volume: ${lastCandle.volume.toFixed(0)}
`;

  // Aqui envia para o chat (exemplo Telegram)
  await sendMessage(chatId, message.trim());
}

async function sendMessage(chatId, message) {
  // Exemplo usando Telegram Bot API - adapte conforme seu bot
  const axios = require('axios');
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('Erro enviando mensagem:', err.message);
  }
}

module.exports = { analyzeAndAlert };
