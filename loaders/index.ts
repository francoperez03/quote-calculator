import logger from "../utils/logger";
import QuotesProvider from "./quotes-provider";
import dependencyInjectorLoader from "./dependency-injector";

export default async () => {
  const quoteProvider = new QuotesProvider();
  logger.info("Websocket client connected");
};
