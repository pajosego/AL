require('dotenv').config();

const { monitorAllTimeframes } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Erro: CHAT_ID não definido. Verifique seu arquivo .env.');
    process.exit(1);
  }

  await monitorAllTimeframes(CHAT_ID);
  setInterval(() => monitorAllTimeframes(CHAT_ID), 60 * 1000); // Atualiza a cada minuto

  process.stdin.resume(); // Mantém o processo vivo
}

start();
