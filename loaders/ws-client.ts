import ws from "ws";
import * as dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const BTC_USD_SYMBOL = "BTCUSD";
const ETH_USD_SYMBOL = "ETHUSD";
const WS_SERVER_URL = process.env.WS_SERVER_URL || "";

const DATA_INDEX = 1;
const BID_INDEX = 0;
const BID_SIZE_INDEX = 1;
const ASK_INDEX = 2;
const ASK_SIZE_INDEX = 3;

export default () => {
  const wsClient = new ws(WS_SERVER_URL);
  const quotes = new Map();
  const currencies = new Map();
  wsClient.on("open", () => {
    wsClient.send(
      JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: BTC_USD_SYMBOL,
      })
    );

    wsClient.send(
      JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: ETH_USD_SYMBOL,
      })
    );
  });

  wsClient.on("message", (data: Buffer) => {
    logger.info("A message arrived!");
    const dataParsed = JSON.parse(data.toString());
    if (dataParsed.event === "subscribed") {
      if (dataParsed.pair === BTC_USD_SYMBOL)
        currencies.set(dataParsed.chanId, BTC_USD_SYMBOL);
      if (dataParsed.pair === ETH_USD_SYMBOL)
        currencies.set(dataParsed.chanId, ETH_USD_SYMBOL);
    }
    if (dataParsed.length > 1 && dataParsed[DATA_INDEX] !== "hb") {
      quotes.set(currencies.get(dataParsed[0]), {
        bid: dataParsed[DATA_INDEX][BID_INDEX],
        bidSize: dataParsed[DATA_INDEX][BID_SIZE_INDEX],
        ask: dataParsed[DATA_INDEX][ASK_INDEX],
        askSize: dataParsed[DATA_INDEX][ASK_SIZE_INDEX],
      });
      logger.info(quotes.get(BTC_USD_SYMBOL));
      logger.info(quotes.get(ETH_USD_SYMBOL));
    }
  });
  return wsClient;
};
