import ws from "ws";
import * as dotenv from "dotenv";
import logger from "../utils/logger";
import { Container } from "typedi";
import { IRateProvider } from "interfaces/rate-provider.interface";
import Tree from "avl";
dotenv.config();

const BTC_USD_SYMBOL = "BTCUSD";
const ETH_USD_SYMBOL = "ETHUSD";
const WS_SERVER_URL = process.env.WS_SERVER_URL || "";

const wsClient = new ws(WS_SERVER_URL);
const pairsRegistered = new Map();
const orderBooksRegistered = new Map();
const rates = new Map();
const orderBooks = new Map(); //orderBooks {key:'pairName',data:AVLTree}

export default class RateProvider implements IRateProvider {
  constructor() {
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

      wsClient.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          symbol: ETH_USD_SYMBOL,
        })
      );
    });

    wsClient.on("message", (data: Buffer) => {
      // logger.info("A message arrived!");
      const dataParsed = JSON.parse(data.toString());
      if (!Array.isArray(dataParsed)) {
        this.registerMaps({ dataParsed });
      } else {
        const [channelId, payload] = dataParsed;
        if (pairsRegistered.has(channelId)) {
          const [bid, bidSize, ask, askSize] = payload;
          rates.set(pairsRegistered.get(channelId), {
            bid,
            bidSize,
            ask,
            askSize,
          });
        } else if (orderBooksRegistered.has(channelId)) {
          if (Array.isArray(payload)) {
            payload.forEach((payloadRow) => {
              this.updateOrderBook({ channelId, payload: payloadRow });
            });
          } else {
            this.updateOrderBook({ channelId, payload });
          }
        }
      }
    });
  }

  private registerMaps({ dataParsed }: { dataParsed: any }) {
    const { channel, pair, chanId } = dataParsed;
    if (channel === "ticker") {
      if (pair === BTC_USD_SYMBOL) pairsRegistered.set(chanId, BTC_USD_SYMBOL);
      if (pair === ETH_USD_SYMBOL) pairsRegistered.set(chanId, ETH_USD_SYMBOL);
    }
    if (channel === "book") {
      if (pair === BTC_USD_SYMBOL) {
        orderBooksRegistered.set(chanId, BTC_USD_SYMBOL);
        orderBooks.set(BTC_USD_SYMBOL + "_BIDS", new Tree());
        orderBooks.set(BTC_USD_SYMBOL + "_ASKS", new Tree());
      }
      if (pair === ETH_USD_SYMBOL) {
        orderBooksRegistered.set(chanId, ETH_USD_SYMBOL);
        orderBooks.set(ETH_USD_SYMBOL + "_BIDS", new Tree());
        orderBooks.set(ETH_USD_SYMBOL + "_ASKS", new Tree());
      }
    }
  }

  private updateOrderBook({
    channelId,
    payload,
  }: {
    channelId: number;
    payload: any;
  }) {
    const [price, count, amount] = payload;
    if (count > 0) {
      if (amount > 0) {
        const orderBook = orderBooks.get(
          orderBooksRegistered.get(channelId) + "_BIDS"
        );
        orderBook.remove(price);
        orderBook.insert(price, { count, amount });
      } else if (amount < 0) {
        const orderBook = orderBooks.get(
          orderBooksRegistered.get(channelId) + "_ASKS"
        );
        orderBook.remove(price);
        orderBook.insert(price, { count, amount });
      }
    } else {
      if (amount === 1) {
        const orderBook = orderBooks.get(
          orderBooksRegistered.get(channelId) + "_BIDS"
        );
        orderBook.remove(price);
      } else if (amount === -1) {
        const orderBook = orderBooks.get(
          orderBooksRegistered.get(channelId) + "_ASKS"
        );
        orderBook.remove(price);
      }
    }
  }

  getQuote({
    pair,
    operation,
    amount,
  }: {
    pair: string;
    operation: string;
    amount: number;
  }) {}

  getRate({ pair }: { pair: string }) {
    if (rates.has(pair)) {
      return rates.get(pair);
    }
    throw new Error("Rate not supported");
  }
}

Container.set("RateProvider", new RateProvider());
