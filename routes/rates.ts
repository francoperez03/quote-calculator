import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../utils/api-response";
import { NotFoundError } from "utils/api-error";
import { celebrate, Joi, Segments, errors } from "celebrate";
import RateService from "../services/rates";
import { Container } from "typedi";
const router = express.Router();

router.get(
  "/quotes",
  celebrate({
    [Segments.QUERY]: {
      pair: Joi.string(),
      operation: Joi.string(),
      amount: Joi.number(),
    },
  }),
  async (req: Request, res: Response) => {
    const pair: string = req.query["pair"] as string;
    const operation: string = req.query["operation"] as string;
    const amount: number = parseInt(req.query["amount"] as string);
    const rateService = Container.get(RateService);
    const result = await rateService.getQuote({ pair, operation, amount });
    return new SuccessResponse("Success", result).send(res);
  }
);

router.get(
  "/:pair",
  celebrate({
    [Segments.PARAMS]: {
      pair: Joi.string(),
    },
  }),
  async (req: Request, res: Response) => {
    const pair: string = req.params["pair"] || "";
    const rateService = Container.get(RateService);
    const result = await rateService.getRate({ pair });
    return new SuccessResponse("Success", result).send(res);
  }
);

router.use(errors());
export default router;
