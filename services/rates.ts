import { Service, Inject } from "typedi";
import { IQuotesProvider } from "interfaces/quotes-provider.interface";
import QuotesProvider from "../loaders/quotes-provider";

@Service()
export default class RateService {
  constructor(
    @Inject()
    private quoteProvider: QuotesProvider
  ) {}

  public async getConversionRate({ rate }: { rate: string }) {
    try {
      console.log(this.quoteProvider);
      const result = this.quoteProvider.getRate(rate);
      console.log("RESULT:", { result });
      return result;
    } catch (e) {
      console.log({ e });
      return { delivered: 0, status: "error" };
    }
  }
}
