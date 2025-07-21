// Detecta suportes e resistências baseadas em níveis Fibonacci
// Aqui vamos usar níveis fixos 0.236, 0.382, 0.5, 0.618, 0.786

function calculateFiboLevels(high, low) {
  const diff = high - low;
  return {
    fib0236: +(high - 0.236 * diff).toFixed(6),
    fib0382: +(high - 0.382 * diff).toFixed(6),
    fib0500: +(high - 0.5 * diff).toFixed(6),
    fib0618: +(high - 0.618 * diff).toFixed(6),
    fib0786: +(high - 0.786 * diff).toFixed(6)
  };
}

function isNearFiboLevel(price, fiboLevels, tolerance = 0.002) {
  return Object.values(fiboLevels).some(level => Math.abs(price - level) / level < tolerance);
}

function detectSupportResistance(candles, tolerance = 0.005) {
  const levels = [];

  for (let i = 2; i < candles.length - 2; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];
    const next = candles[i + 1];

    const isSupport = curr.low < prev.low && curr.low < next.low;
    const isResistance = curr.high > prev.high && curr.high > next.high;

    if (isSupport) levels.push(+curr.low.toFixed(6));
    if (isResistance) levels.push(+curr.high.toFixed(6));
  }

  return Array.from(new Set(levels));
}

module.exports = { calculateFiboLevels, isNearFiboLevel, detectSupportResistance };
