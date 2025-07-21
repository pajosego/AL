async function sendAlert(message) {
  console.log(`[ALERTA] ${message}`);
  // Se quiser usar Telegram:
  // await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

module.exports = { sendAlert };
