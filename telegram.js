const axios = require('axios');
const { log } = require('./logger');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramAlert(chatId, text) {
  if (!TELEGRAM_TOKEN) {
    log('❌ TELEGRAM_TOKEN não definido.');
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
    log('Erro ao enviar alerta para Telegram: ' + err.message);
  }
}

module.exports = { sendTelegramAlert };
