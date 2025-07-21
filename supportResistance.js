function calculatePivots(candles) {
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);

  const resistance = Math.max(...highs);
  const support = Math.min(...lows);

  return {
    resistance,
    support
  };
}

module.exports = { calculatePivots };
