function detectSupportResistance(candles) {
  // Exemplo simplificado para detectar níveis SR (pode melhorar)
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);

  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);

  // Retorna array com níveis SR simples
  return [maxHigh, minLow];
}

function calculatePivots(candles) {
  if (!candles || candles.length === 0) return {};

  const last = candles[candles.length - 1];
  const high = last.high;
  const low = last.low;
  const close = last.close;

  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const s1 = 2 * pivot - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);

  return { pivot, r1, s1, r2, s2 };
}

module.exports = { detectSupportResistance, calculatePivots };
