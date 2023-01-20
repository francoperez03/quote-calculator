import logger from "../utils/logger";
import wsClientLoader from "./ws-client";

export default async () => {
  wsClientLoader();
  logger.info("Websocket client connected");
};
