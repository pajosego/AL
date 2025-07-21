// Aqui deve estar a implementação da sua fonte de dados — exemplo Binance, Twelve Data, etc.
// Para fins de exemplo, assumimos Twelve Data (API_KEY no .env)

const axios = require('axios');
const API_KEY = process.env.TWELVE_API_KEY;

async function fetchCandles(symbol, timeframe) {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${timeframe}&apikey=${API_KEY}&format=json&outputsize=100`;

  const response = await axios.get(url);
  if (response.data && response.data.values) {
    // Valores estão em ordem decrescente (mais recente primeiro), inverter para análise
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

module.exports = { fetchCandles };
