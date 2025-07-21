function calculatePivots(candles) {
  // Exemplo simplificado: pivô = preço médio do candle
  return candles.map(c => (c.high + c.low + c.close) / 3);
}

function detectSupportResistance(candles) {
  // Exemplo básico: pegar os mínimos e máximos mais relevantes
  const lows = candles.map(c => c.low);
  const highs = candles.map(c => c.high);
  const support = Math.min(...lows);
  const resistance = Math.max(...highs);
  return [support, resistance];
}

module.exports = { calculatePivots, detectSupportResistance };
