require('dotenv').config();

const { monitorAllTimeframes } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

const symbolsToMonitor = [
  // Top 5 Criptos da XTB
  'BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD',
  // Top 5 Forex da XTB
  'EURUSD', 'USDJPY', 'GBPUSD', 'AUDUSD', 'USDCAD',
  // Top 5 Índices da XTB
  'US500', 'US100', 'US30', 'DE30', 'UK100',
  // Top 5 Stocks da XTB
  'AAPL.US', 'TSLA.US', 'JPM.US', 'MC.FR', 'SHEL.US'
];

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Erro: CHAT_ID não definido. Verifique seu arquivo .env.');
    process.exit(1);
  }

  await monitorAllTimeframes(CHAT_ID, symbolsToMonitor);
  setInterval(() => monitorAllTimeframes(CHAT_ID, symbolsToMonitor), 60 * 1000); // A cada minuto

  process.stdin.resume();
}

start();
