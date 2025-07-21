// alerts.js
const { sendTelegramAlert } = require('./sendTelegramAlert');
const { detectSupportResistance } = require('./supportResistance');
const { isNearFiboLevel } = require('./fibonacciLevels');

async function analyzeAndAlert(symbol, timeframe, candles, pivots, chatId) {
  if (!candles || candles.length === 0) {
    console.log(`[Alert] Sem candles para analisar ${symbol} ${timeframe}`);
    return;
  }

  const lastCandle = candles[candles.length - 1];
  const srLevels = detectSupportResistance(candles);

  let alert = '';

  // Exemplo simplificado: alerta se romper suporte ou resistência com volume alto
  for (const level of srLevels) {
    const isSupport = lastCandle.low <= level;
    const isResistance = lastCandle.high >= level;

    // Suporte rompido e reteste (exemplo simplificado)
    if (isSupport && lastCandle.volume > averageVolume(candles)) {
      if (isNearFiboLevel(level, pivots)) {
        alert = `📉 ${symbol} (${timeframe}) possível rompimento de suporte em ${level.toFixed(4)} confirmado por Fibonacci. Volume forte.`;
        break;
      }
    }

    // Resistência rompida e reteste
    if (isResistance && lastCandle.volume > averageVolume(candles)) {
      if (isNearFiboLevel(level, pivots)) {
        alert = `📈 ${symbol} (${timeframe}) possível rompimento de resistência em ${level.toFixed(4)} confirmado por Fibonacci. Volume forte.`;
        break;
      }
    }
  }

  if (alert) {
    try {
      await sendTelegramAlert(chatId, alert);
      console.log(`[Alert] Enviado: ${alert}`);
    } catch (error) {
      console.error(`[Alert] Erro ao enviar alerta: ${error.message}`);
    }
  } else {
    console.log(`[Alert] Nenhum alerta para ${symbol} (${timeframe})`);
  }
}

function averageVolume(candles) {
  const sum = candles.reduce((acc, c) => acc + c.volume, 0);
  return sum / candles.length;
}

module.exports = { analyzeAndAlert };
