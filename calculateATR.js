function calculateATR(candles, period = 14) {
  if (candles.length < period + 1) return null;

  const trs = [];
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trs.push(tr);
  }

  // ATR é a média simples dos TRs no período
  const slice = trs.slice(-period);
  const atr = slice.reduce((acc, val) => acc + val, 0) / period;
  return atr;
}

module.exports = { calculateATR };
