import { createLogger, transports, format } from "winston";
import fs from "fs";
import path from "path";
import { environment, logDirectory } from "../config";

let dir = logDirectory;
if (!dir) dir = path.resolve("logs");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logLevel = environment === "development" ? "debug" : "warn";

export default createLogger({
  transports: [new transports.Console()],
});
