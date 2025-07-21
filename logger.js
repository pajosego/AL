const chalk = require('chalk');

function info(msg) {
  console.log(chalk.blue('[INFO]'), msg);
}

function warn(msg) {
  console.log(chalk.yellow('[WARN]'), msg);
}

function error(msg) {
  console.error(chalk.red('[ERROR]'), msg);
}

function debug(msg) {
  if (process.env.DEBUG === 'true') {
    console.log(chalk.gray('[DEBUG]'), msg);
  }
}

module.exports = { info, warn, error, debug };
