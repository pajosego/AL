// fibonacciLevels.js

/**
 * Calcula os níveis de Fibonacci baseados no preço alto e baixo do período.
 * Retorna um array com os níveis calculados.
 * Exemplo de níveis: 0.236, 0.382, 0.5, 0.618, 0.786
 */
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

/**
 * Verifica se um preço está próximo de algum nível de Fibonacci.
 * @param {number} price - preço a verificar
 * @param {object} pivots - objeto com níveis de Fibonacci (exemplo output de calculateFiboLevels)
 * @param {number} tolerance - margem de tolerância (ex: 0.001 para 0.1%)
 * @returns {boolean}
 */
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
