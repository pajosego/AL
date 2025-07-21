// atr.js
function calculateATR(candles, period = 14) {
  if (candles.length < period + 1) return null;

  let trs = [];
  for (let i = 1; i <= period; i++) {
    const current = candles[candles.length - 1 - (period - i)];
    const prev = candles[candles.length - 2 - (period - i)];

    const highLow = current.high - current.low;
    const highClose = Math.abs(current.high - prev.close);
    const lowClose = Math.abs(current.low - prev.close);

    const tr = Math.max(highLow, highClose, lowClose);
    trs.push(tr);
  }

  const atr = trs.reduce((sum, val) => sum + val, 0) / period;
  return atr;
}

module.exports = { calculateATR };
