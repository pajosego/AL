// index.js
require('dotenv').config();

const { monitorAllTimeframes } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

const symbolsToMonitor = [
  'BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD',
  'EURUSD', 'USDJPY', 'GBPUSD', 'AUDUSD', 'USDCAD',
  'US500', 'US100', 'US30', 'DE30', 'UK100',
  'AAPL.US', 'TSLA.US', 'JPM.US', 'MC.FR', 'SHEL.US'
];

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Erro: CHAT_ID não definido. Verifique seu arquivo .env.');
    process.exit(1);
  }

  await monitorAllTimeframes(CHAT_ID, symbolsToMonitor);
  setInterval(() => monitorAllTimeframes(CHAT_ID, symbolsToMonitor), 60 * 1000);
  process.stdin.resume();
}

start();