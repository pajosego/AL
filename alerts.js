const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendAlert(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Bot token ou chat ID não configurados no .env');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('✅ Alerta enviado');
  } catch (err) {
    console.error('❌ Erro ao enviar alerta:', err.message);
  }
}

module.exports = { sendAlert };
