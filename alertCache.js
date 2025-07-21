// alertCache.js
const alertCache = new Map();
const ALERT_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutos

function wasAlertSent(key) {
  const timestamp = alertCache.get(key);
  if (!timestamp) return false;

  if (Date.now() - timestamp > ALERT_EXPIRATION_MS) {
    alertCache.delete(key);
    return false;
  }
  return true;
}

function markAlertSent(key) {
  alertCache.set(key, Date.now());
}

module.exports = { wasAlertSent, markAlertSent };
