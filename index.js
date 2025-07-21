const { monitorAllTimeframes } = require('./monitor');

// ID do chat (caso use Telegram). Use `null` se estiver apenas testando com console.log
const chatId = null;

// Lista de criptos monitoradas (só criptos com suporte na Binance)
const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD'];

async function startMonitoring() {
  console.log(`[Monitor] Iniciando varredura às ${new Date().toISOString()}`);
  await monitorAllTimeframes(chatId, cryptoSymbols);
}

// Executa a cada 5 minutos (300.000 ms)
startMonitoring(); // Executa imediatamente
setInterval(startMonitoring, 5 * 60 * 1000);
