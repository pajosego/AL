function calculateFibonacciLevels(candles) {
  const last = candles[candles.length - 2]; // anterior ao candle atual
  const high = last.high;
  const low = last.low;

  const diff = high - low;

  const levels = [0.236, 0.382, 0.5, 0.618, 0.786].map(fib => high - diff * fib);
  return levels;
}

function isNearFiboLevel(price, fibLevels, tolerance = 0.005) {
  return fibLevels.some(level => Math.abs(price - level) / price < tolerance);
}

module.exports = { calculateFibonacciLevels, isNearFiboLevel };
