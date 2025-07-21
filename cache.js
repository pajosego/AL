// cache.js
const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  const now = Date.now();
  if (now - entry.timestamp > 60 * 1000) { // 1 minuto
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

module.exports = { getCache, setCache };
