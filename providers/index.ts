import logger from "../utils/logger";
import RateProvider from "./rate-provider";

export default async () => {
  const rateProvider = new RateProvider();
  logger.info("Websocket client connected");
};
