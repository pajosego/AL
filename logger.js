function timestamp() {
  return new Date().toISOString();
}

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`);
}

module.exports = { log };
