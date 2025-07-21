// fibonacci.js

function isNearFiboLevel(price, fibLevels, tolerance = 0.002) {
  return fibLevels.some(level => Math.abs(price - level) / level <= tolerance);
}

function calculateFibonacciLevels(high, low) {
  const diff = high - low;
  return [
    low,
    low + 0.236 * diff,
    low + 0.382 * diff,
    low + 0.5 * diff,
    low + 0.618 * diff,
    high
  ];
}

module.exports = { isNearFiboLevel, calculateFibonacciLevels };
