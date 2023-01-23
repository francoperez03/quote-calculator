import { Service, Inject } from "typedi";
import { IRateProvider } from "interfaces/rate-provider.interface";
import logger from "../utils/logger";

@Service()
export default class RateService {
  constructor(
    @Inject("RateProvider")
    private rateProvider: IRateProvider
  ) {}

  public async getQuote({
    pair,
    operation,
    amount,
  }: {
    pair: string;
    operation: string;
    amount: number;
  }) {
    try {
      //Quiero comprar 10 ETH
      let effectivePrice = 0;
      let amountleft = amount;
      let index = 0;
      const orderBook = this.rateProvider.getOrderBook({ pair, operation });
      if (operation === "buy") {
        do {
          console.log({ orderBook });
          console.log({ amountleft });
          if (amountleft < orderBook[index].amount) {
            effectivePrice += amountleft * orderBook[index].price;
          } else {
            effectivePrice += orderBook[index].amount * orderBook[index].price;
          }
          amountleft -= orderBook[index].amount;
          index++;
        } while (index < orderBook.length && amountleft > 0);
      }
      return effectivePrice;
    } catch (e) {
      logger.error("rates service", { e });
      return { delivered: 0, status: "error" };
    }
  }

  public async getRate({ pair }: { pair: string }) {
    try {
      const result = this.rateProvider.getRate({ pair });
      return result;
    } catch (e) {
      logger.error("rates service", { e });
      return { delivered: 0, status: "error" };
    }
  }
}
