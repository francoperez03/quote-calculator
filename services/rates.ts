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
      //LOGIC
      const result = this.rateProvider.getQuote({ pair, operation, amount });
      return result;
    } catch (e) {
      logger.error({ e });
      return { delivered: 0, status: "error" };
    }
  }

  public async getRate({ pair }: { pair: string }) {
    try {
      const result = this.rateProvider.getRate({ pair });
      return result;
    } catch (e) {
      logger.error({ e });
      return { delivered: 0, status: "error" };
    }
  }
}
