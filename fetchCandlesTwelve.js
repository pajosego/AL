// fetchCandlesTwelve.js
const axios = require('axios');
const API_KEY = process.env.TWELVE_API_KEY;

async function fetchCandlesTwelve(symbol, timeframe) {
  const formattedSymbol = symbol.includes('.') ? symbol.replace('.', '/') : symbol;

  const url = `https://api.twelvedata.com/time_series?symbol=${formattedSymbol}&interval=${timeframe}&apikey=${API_KEY}&format=json&outputsize=100`;

  const response = await axios.get(url);

  if (response.data && response.data.values) {
    return response.data.values.reverse().map(candle => ({
      datetime: candle.datetime,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume),
    }));
  } else {
    throw new Error('Dados inválidos recebidos da API Twelve Data');
  }
}

module.exports = { fetchCandlesTwelve };
