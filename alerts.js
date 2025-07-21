const { sendTelegramAlert } = require('./sendTelegramAlert');
const { detectSupportResistance, calculatePivots } = require('./supportResistance');
const { isNearFiboLevel } = require('./fibonacciLevels');

async function analyzeAndAlert(symbol, timeframe, candles, pivots, chatId) {
  if (!candles || candles.length === 0) {
    console.log(`[Alert] Sem candles para analisar ${symbol} (${timeframe})`);
    return;
  }

  const lastCandle = candles[candles.length - 1];
  const srLevels = detectSupportResistance(candles);

  let alert = '';

  for (const level of srLevels) {
    const isSupportBroken = lastCandle.low <= level;
    const isResistanceBroken = lastCandle.high >= level;

    if (isSupportBroken && lastCandle.volume > averageVolume(candles)) {
      if (isNearFiboLevel(level, pivots)) {
        alert = `📉 ${symbol} (${timeframe}) possível rompimento de suporte em ${level.toFixed(4)} confirmado por Fibonacci. Volume forte.`;
        break;
      }
    }

    if (isResistanceBroken && lastCandle.volume > averageVolume(candles)) {
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
  return candles.reduce((acc, c) => acc + c.volume, 0) / candles.length;
}

module.exports = { analyzeAndAlert };
