const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramAlert(chatId, text) {
  if (!TELEGRAM_TOKEN) {
    console.error('❌ TELEGRAM_TOKEN não definido.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    console.error('Erro ao enviar alerta para Telegram:', err.message);
  }
}

module.exports = { sendTelegramAlert };

