import express, { Request, Response, NextFunction } from "express";
import logger from "./utils/logger";
import cors from "cors";
import { corsUrl, environment, port } from "./config";
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from "./utils/api-error";
import routes from "./routes";

process.on("uncaughtException", (e) => {
  logger.error(e);
});
async function startServer() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use(
    express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
  );
  app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

  // Routes
  app.use("/", routes);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) =>
    next(new NotFoundError())
  );

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      ApiError.handle(err, res);
      if (err.type === ErrorType.INTERNAL)
        logger.error(
          `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
    } else {
      logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      logger.error(err);
      if (environment === "development") {
        return res.status(500).send(err);
      }
      ApiError.handle(new InternalError(), res);
    }
  });
  app
    .listen(port, () => {
      logger.info(`server running on port : ${port}`);
    })
    .on("error", (e: any) => logger.error(e));
}

startServer();
