function calculateFiboLevels(high, low) {
  const diff = high - low;
  return {
    0.236: high - diff * 0.236,
    0.382: high - diff * 0.382,
    0.5: high - diff * 0.5,
    0.618: high - diff * 0.618,
    0.786: high - diff * 0.786,
  };
}

function isNearFiboLevel(price, pivots, tolerance = 0.001) {
  for (const key in pivots) {
    const level = pivots[key];
    const diffPercent = Math.abs(price - level) / level;
    if (diffPercent <= tolerance) {
      return true;
    }
  }
  return false;
}

module.exports = { calculateFiboLevels, isNearFiboLevel };
