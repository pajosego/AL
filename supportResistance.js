// supportResistance.js
function calculatePivots(candles) {
  if (!candles.length) throw new Error('Sem candles para calcular pivots.');

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const closes = candles.map(c => c.close);

  const high = Math.max(...highs);
  const low = Math.min(...lows);
  const close = closes[closes.length - 1];

  // Pivot simples (clássico)
  const pivot = (high + low + close) / 3;

  // Suporte e resistência
  const resistance = 2 * pivot - low;
  const support = 2 * pivot - high;

  return { pivot, resistance, support };
}

module.exports = { calculatePivots };
