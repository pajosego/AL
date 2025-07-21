require('dotenv').config(); // Isto pode continuar, não interfere
const { monitor } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

async function start() {
  if (!CHAT_ID) {
    console.error('❌ Variável CHAT_ID não definida.');
    return;
  }

  await monitor(CHAT_ID);
  setInterval(() => monitor(CHAT_ID), 15 * 60 * 1000);

  process.stdin.resume();
}

start();
