// fetchCandlesTwelve.js
const axios = require('axios');
const API_KEY = process.env.TWELVE_API_KEY;

async function fetchCandlesTwelve(symbol, timeframe) {
  const formattedSymbol = symbol.includes('.') ? symbol : symbol.replace('/', '.');

  const url = `https://api.twelvedata.com/time_series?symbol=${formattedSymbol}&interval=${timeframe}&apikey=${API_KEY}&format=json&outputsize=100`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (data.status === 'error') {
      throw new Error(data.message || 'Erro desconhecido da API Twelve Data');
    }

    if (!data || !Array.isArray(data.values)) {
      throw new Error(`Resposta inesperada da API Twelve para ${symbol}`);
    }

    return data.values.reverse().map(candle => ({
      datetime: candle.datetime,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume),
    }));
  } catch (error) {
    throw new Error(`Erro na API Twelve Data: ${error.message}`);
  }
}

module.exports = { fetchCandlesTwelve };
