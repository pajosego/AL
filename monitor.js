const { fetchCandlesTwelve } = require('./fetchCandles');
const { fetchCandlesBinance } = require('./fetchCandlesBinance');
const { calculatePivots } = require('./supportResistance');
const { calculateATR } = require('./atr');
const { sendAlert } = require('./alerts');

const TIMEFRAMES = ['1h', '4h', '1d'];

const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'LTCUSD'];

function isCrypto(symbol) {
  return cryptoSymbols.includes(symbol);
}

async function monitorAllTimeframes(chatId, symbols) {
  for (const symbol of symbols) {
    for (const timeframe of TIMEFRAMES) {
      try {
        let candles;
        if (isCrypto(symbol)) {
          candles = await fetchCandlesBinance(symbol, timeframe);
        } else {
          candles = await fetchCandlesTwelve(symbol, timeframe);
        }

        if (!candles || candles.length === 0) {
          console.warn(`[Monitor] Sem candles para ${symbol} (${timeframe})`);
          continue;
        }

        const pivots = calculatePivots(candles);
        const atr = calculateATR(candles);

        if (!atr) {
          console.warn(`[Monitor] ATR insuficiente para ${symbol} (${timeframe})`);
          continue;
        }

        // Último candle
        const lastCandle = candles[candles.length - 1];

        // Critério para rompimento confirmado:
        // Último fechamento acima da resistência + volume maior que média
        const avgVolume = candles.reduce((acc, c) => acc + c.volume, 0) / candles.length;

        const strongVolume = lastCandle.volume > avgVolume * 1.5; // volume 50% maior que a média

        // Verifica rompimento resistência
        if (lastCandle.close > pivots.resistance && strongVolume) {
          // Define entrada, stoploss e take profit usando ATR
          const entry = lastCandle.close;
          const stopLoss = entry - atr * 1.5;
          const takeProfit = entry + atr * 3;

          const message =
            `📈 *${symbol}* (${timeframe}) rompimento de *resistência* confirmado!\n` +
            `Entrada: ${entry.toFixed(4)}\n` +
            `Stop Loss: ${stopLoss.toFixed(4)}\n` +
            `Take Profit: ${takeProfit.toFixed(4)}\n` +
            `Volume: Forte (${lastCandle.volume.toFixed(0)})`;

          await sendAlert(message);
        }
        // Verifica rompimento suporte
        else if (lastCandle.close < pivots.support && strongVolume) {
          const entry = lastCandle.close;
          const stopLoss = entry + atr * 1.5;
          const takeProfit = entry - atr * 3;

          const message =
            `📉 *${symbol}* (${timeframe}) rompimento de *suporte* confirmado!\n` +
            `Entrada: ${entry.toFixed(4)}\n` +
            `Stop Loss: ${stopLoss.toFixed(4)}\n` +
            `Take Profit: ${takeProfit.toFixed(4)}\n` +
            `Volume: Forte (${lastCandle.volume.toFixed(0)})`;

          await sendAlert(message);
        } else {
          console.log(`[Monitor] ${symbol} (${timeframe}) sem rompimento confirmado.`);
        }
      } catch (err) {
        console.error(`[Monitor] Erro ao monitorar ${symbol} (${timeframe}): ${err.message}`);
      }
    }
  }
}

module.exports = { monitorAllTimeframes };
