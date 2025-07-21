require('dotenv').config();

const { monitorAllTimeframes } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

const symbolsToMonitor = [
  // Criptos Binance
  'BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD',
  // Forex (Twelve Data)
  'EURUSD', 'USDJPY', 'GBPUSD', 'AUDUSD', 'USDCAD',
  // Índices (Twelve Data)
  'US500', 'US100', 'US30', 'DE30', 'UK100',
  // Stocks (Twelve Data)
  'AAPL.US', 'TSLA.US', 'JPM.US', 'MC.FR', 'SHEL.US'
];

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Erro: CHAT_ID não definido no .env');
    process.exit(1);
  }

  await monitorAllTimeframes(CHAT_ID, symbolsToMonitor);
  setInterval(() => monitorAllTimeframes(CHAT_ID, symbolsToMonitor), 60 * 1000); // a cada 1 minuto

  process.stdin.resume();
}

start();
