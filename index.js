// index.js
require('dotenv').config();  // só precisa no local, no Railway as env vars já existem

const { monitor } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

if (!CHAT_ID) {
  console.error('❌ Variável CHAT_ID não definida. Verifique seu .env ou as variáveis do Railway.');
  process.exit(1);
}

async function start() {
  try {
    await monitor(CHAT_ID);

    // Executa o monitor a cada 15 minutos
    setInterval(() => monitor(CHAT_ID), 15 * 60 * 1000);

    // Mantém o processo ativo
    process.stdin.resume();
  } catch (error) {
    console.error('Erro ao iniciar o monitor:', error);
    process.exit(1);
  }
}

start();
