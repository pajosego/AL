const axios = require('axios');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramAlert(chatId, message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  });
}

module.exports = { sendTelegramAlert };
