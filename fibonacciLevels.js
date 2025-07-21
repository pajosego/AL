// fibonacciLevels.js

/**
 * Verifica se um nível está próximo de algum nível Fibonacci dado.
 * @param {number} level - O nível de preço a verificar.
 * @param {number[]} pivots - Array dos níveis Fibonacci calculados.
 * @param {number} tolerance - Tolerância percentual para considerar próximo (ex: 0.005 = 0.5%).
 * @returns {boolean} true se level estiver dentro da tolerância de algum pivot.
 */
function isNearFiboLevel(level, pivots, tolerance = 0.005) {
  for (const pivot of pivots) {
    if (Math.abs((level - pivot) / pivot) <= tolerance) {
      return true;
    }
  }
  return false;
}

module.exports = { isNearFiboLevel };
