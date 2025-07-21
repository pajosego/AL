function calculateFibonacciLevels(candles) {
  if (candles.length < 1) return [];
  const lastCandle = candles.at(-1);
  const high = lastCandle.high;
  const low = lastCandle.low;
  const diff = high - low;
  return [
    { level: low, label: '0%' },
    { level: low + 0.236 * diff, label: '23.6%' },
    { level: low + 0.382 * diff, label: '38.2%' },
    { level: low + 0.5 * diff, label: '50%' },
    { level: low + 0.618 * diff, label: '61.8%' },
    { level: low + 0.786 * diff, label: '78.6%' },
    { level: high, label: '100%' }
  ];
}

function isNearFiboLevel(price, fiboLevels, tolerance = 0.003) {
  return fiboLevels.some(fibo => Math.abs(price - fibo.level) / fibo.level <= tolerance);
}

module.exports = { calculateFibonacciLevels, isNearFiboLevel };