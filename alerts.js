const { sendTelegramAlert } = require('./telegram');
const { log } = require('./logger');
const { isStrongBullishCandle, isStrongBearishCandle } = require('./candles');

async function analyzeAndAlert(symbol, timeframe, candles, levels, chatId) {
  const last = candles[candles.length - 1];
  const previous = candles[candles.length - 2];

  const messageHeader = `📊 *${symbol}* (${timeframe})`;

  const alertConditions = [];

  // Suporte e resistência rompido
  levels.levels.forEach((level) => {
    const touchedSupport = previous.low > level && last.low <= level;
    const touchedResistance = previous.high < level && last.high >= level;

    if (touchedSupport && isStrongBearishCandle(last)) {
      alertConditions.push(`🔻 Rompido Suporte em ${level}`);
    }

    if (touchedResistance && isStrongBullishCandle(last)) {
      alertConditions.push(`🔺 Rompida Resistência em ${level}`);
    }
  });

  // Ponto Pivot
  if (levels.pivot) {
    const { pivot, R1, R2, S1, S2 } = levels.pivot;
    if (last.close > R2) {
      alertConditions.push(`🚀 Acima de R2 (${R2})`);
    } else if (last.close < S2) {
      alertConditions.push(`⚠️ Abaixo de S2 (${S2})`);
    }
  }

  // Fibonacci
  if (levels.fibo) {
    const nearFibo = levels.fibo.find(level => Math.abs((level - last.close) / last.close) < 0.005);
    if (nearFibo) {
      alertConditions.push(`🔄 Próximo nível de Fibonacci: ${nearFibo.toFixed(2)}`);
    }
  }

  if (alertConditions.length > 0) {
    const message = `${messageHeader}\n\n${alertConditions.join('\n')}\n\n📈 Candle Fechou: ${last.close}`;
    await sendTelegramAlert(chatId, message);
    log(`[Alert] ${symbol} ${timeframe} ➝ ${alertConditions.join(' | ')}`);
  } else {
    log(`[Monitor] ${symbol} ${timeframe} ➝ Nenhuma condição atendida`);
  }
}

module.exports = { analyzeAndAlert };
