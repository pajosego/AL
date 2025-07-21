const FIBO_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

function isNearFiboLevel(level, pivots, tolerance = 0.005) {
  for (const pivot of pivots) {
    for (const fib of FIBO_LEVELS) {
      const fibLevel = pivot * fib;
      if (Math.abs(level - fibLevel) / fibLevel < tolerance) {
        return true;
      }
    }
  }
  return false;
}

module.exports = { isNearFiboLevel };
