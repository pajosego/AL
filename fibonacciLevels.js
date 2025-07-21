// fibonacciLevels.js

// Verifica se um preço está próximo de algum nível de Fibonacci
// pivots: array dos níveis calculados (ex: [0.382, 0.5, 0.618] aplicados a preço base)
// level: preço atual a verificar
function isNearFiboLevel(level, pivots, tolerance = 0.005) {
  for (const pivot of pivots) {
    // Considera próximo se a diferença percentual for menor que tolerance (ex: 0.5%)
    if (Math.abs((level - pivot) / pivot) <= tolerance) {
      return true;
    }
  }
  return false;
}

module.exports = { isNearFiboLevel };
