function calculatePivots(candles) {
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const pivot = (prev.high + prev.low + prev.close) / 3;
  const support = pivot - (prev.high - prev.low);
  const resistance = pivot + (prev.high - prev.low);

  return { support, resistance };
}

module.exports = { calculatePivots };
