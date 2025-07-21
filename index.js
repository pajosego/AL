require('dotenv').config();

const { monitorAllTimeframes } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

const symbolsToMonitor = [
  'BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD', // Criptos XTB
  'EURUSD', 'USDJPY', 'GBPUSD', 'AUDUSD', 'USDCAD', // Forex XTB
  'US500', 'US100', 'US30', 'DE30', 'UK100',       // Índices XTB
  'AAPL.US', 'TSLA.US', 'JPM.US', 'MC.FR', 'SHEL.US' // Stocks XTB
];

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Erro: CHAT_ID não definido.');
    process.exit(1);
  }

  console.log(`[Monitor] Iniciando monitoramento para símbolos: ${symbolsToMonitor.join(', ')}`);

  await monitorAllTimeframes(CHAT_ID, symbolsToMonitor);
  setInterval(() => monitorAllTimeframes(CHAT_ID, symbolsToMonitor), 60 * 1000); // a cada 1 minuto

  process.stdin.resume();
}

start();
