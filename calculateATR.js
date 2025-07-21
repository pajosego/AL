// calculateATR.js
function calculateATR(candles, period = 14) {
  if (candles.length < period + 1) {
    throw new Error('Candles insuficientes para cálculo do ATR');
  }

  let trs = [];
  for (let i = 1; i <= period; i++) {
    const current = candles[i];
    const prev = candles[i - 1];

    const highLow = current.high - current.low;
    const highClose = Math.abs(current.high - prev.close);
    const lowClose = Math.abs(current.low - prev.close);

    const trueRange = Math.max(highLow, highClose, lowClose);
    trs.push(trueRange);
  }

  // ATR inicial é média simples dos TRs
  let atr = trs.reduce((a, b) => a + b, 0) / period;

  // ATR suavizado para os candles seguintes
  for (let i = period + 1; i < candles.length; i++) {
    const current = candles[i];
    const prev = candles[i - 1];

    const highLow = current.high - current.low;
    const highClose = Math.abs(current.high - prev.close);
    const lowClose = Math.abs(current.low - prev.close);

    const trueRange = Math.max(highLow, highClose, lowClose);

    atr = (atr * (period - 1) + trueRange) / period;
  }

  return atr;
}

module.exports = { calculateATR };
