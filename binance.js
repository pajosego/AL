const axios = require('axios');

async function getCandles(symbol, interval = '5m', limit = 100) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data.map(c => ({
    openTime: c[0],
    open: +c[1],
    high: +c[2],
    low: +c[3],
    close: +c[4],
    volume: +c[5],
    closeTime: c[6]
  }));
}

async function getTopVolatileSymbols() {
  // Pega as 100 moedas e retorna as 10 mais voláteis (variação % maior no último dia)
  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const filtered = res.data.filter(d => d.symbol.endsWith('USDT'));
    filtered.forEach(c => {
      c.priceChangePercent = parseFloat(c.priceChangePercent);
    });
    filtered.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));
    return filtered.slice(0, 10).map(c => c.symbol);
  } catch (e) {
    console.error('[binance] Erro ao buscar símbolos voláteis:', e.message);
    return ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']; // fallback
  }
}

module.exports = { getCandles, getTopVolatileSymbols };
