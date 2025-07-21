// index.js
require('dotenv').config();

console.log('CHAT_ID:', process.env.CHAT_ID);
console.log('TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN ? 'OK' : 'Not found');

const { monitor } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

async function start() {
  if (!CHAT_ID) {
    console.error('Erro: CHAT_ID não definido. Verifique seu arquivo .env ou variáveis de ambiente.');
    process.exit(1);
  }

  await monitor(CHAT_ID);
  setInterval(() => monitor(CHAT_ID), 15 * 60 * 1000); // A cada 15 minutos

  // Mantém o processo ativo (para Railway e similares)
  process.stdin.resume();
}

start();
