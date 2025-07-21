function isStrongBullishCandle(candle) {
  return candle.close > candle.open && (candle.close - candle.open) / (candle.high - candle.low) > 0.6;
}

function isStrongBearishCandle(candle) {
  return candle.open > candle.close && (candle.open - candle.close) / (candle.high - candle.low) > 0.6;
}

module.exports = { isStrongBullishCandle, isStrongBearishCandle };
