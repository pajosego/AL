const { getCandles } = require('./binance');
const { calculatePivotLevels } = require('./pivotPoints');
const { detectSupportResistance } = require('./fibonacci');
const { analyzeAndAlert } = require('./alerts');
const logger = require('./logger');

const TIMEFRAMES = ['1d', '4h', '1h'];

// Cooldown Map para evitar spam { 'SYMBOL_TIMEFRAME': timestamp }
const alertCooldowns = new Map();

function isCooldownActive(key, cooldownMs = 30 * 60 * 1000) { // 30 min cooldown
  const last = alertCooldowns.get(key);
  if (!last) return false;
  return (Date.now() - last) < cooldownMs;
}

function setCooldown(key) {
  alertCooldowns.set(key, Date.now());
}

async function monitorAllTimeframes(chatId, symbols) {
  logger.info(`[Monitor] Símbolos para monitorar: ${symbols.join(', ')}`);

  for (const symbol of symbols) {
    for (const tf of TIMEFRAMES) {
      try {
        const candles = await getCandles(symbol, tf, 200);
        if (!candles || candles.length < 50) {
          logger.warn(`[Monitor] Poucos candles para ${symbol} ${tf}, pulando.`);
          continue;
        }

        const pivots = calculatePivotLevels(candles);
        const levels = detectSupportResistance(candles);

        // Análise e alerta:
        const key = `${symbol}_${tf}`;
        if (isCooldownActive(key)) {
          logger.debug(`[Cooldown] Alerta bloqueado para ${key}`);
          continue;
        }

        const alerted = await analyzeAndAlert(symbol, tf, candles, pivots, levels, chatId);

        if (alerted) {
          logger.info(`[Alerta] Enviado para ${key}`);
          setCooldown(key);
        }
      } catch (err) {
        logger.error(`[Monitor] Erro ao monitorar ${symbol} ${tf}: ${err.message}`);
      }
    }
  }
}

module.exports = { monitorAllTimeframes };
