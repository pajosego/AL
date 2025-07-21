require('dotenv').config();

const { monitor } = require('./monitor');

const CHAT_ID = process.env.CHAT_ID;

if (!CHAT_ID) {
  console.error('❌ Variável CHAT_ID não definida.');
  process.exit(1);
}

async function start() {
  await monitor(CHAT_ID);
  setInterval(() => monitor(CHAT_ID), 15 * 60 * 1000);
  process.stdin.resume(); // Railway
}

start();
