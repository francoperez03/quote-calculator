import { Service, Inject } from "typedi";
import { IRateProvider } from "interfaces/rate-provider.interface";
import logger from "../utils/logger";

@Service()
export default class RateService {
  constructor(
    @Inject("RateProvider")
    private rateProvider: IRateProvider
  ) {}

  public async getConversionRate({ rate }: { rate: string }) {
    try {
      const result = this.rateProvider.getRate(rate);
      return result;
    } catch (e) {
      logger.error({ e });
      return { delivered: 0, status: "error" };
    }
  }
}
