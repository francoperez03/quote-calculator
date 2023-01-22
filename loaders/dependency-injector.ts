import { Container } from "typedi";
import LoggerInstance from "../utils/logger";
import {} from "../config";
import wsClient from "../utils/logger";

export default ({ quoteProvider }: { quoteProvider: any }) => {
  try {
    Container.set("quoteProvider", quoteProvider);
    LoggerInstance.info("Quote Provider container");
  } catch (e) {
    LoggerInstance.error("Error on dependency injector loader: %o", e);
    throw e;
  }
};
