const axios = require('axios');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramAlert(chatId, message) {
  if (!TELEGRAM_TOKEN) {
    console.error('❌ TELEGRAM_TOKEN não definido no .env');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error(`❌ Erro ao enviar mensagem Telegram: ${err.message}`);
  }
}

module.exports = { sendTelegramAlert };
