import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../utils/api-response";
import { NotFoundError } from "utils/api-error";
import { celebrate, Joi, Segments, errors } from "celebrate";
import RateService from "../services/rates";
import { Container } from "typedi";
const router = express.Router();

router.get(
  "/:rate",
  celebrate({
    [Segments.PARAMS]: {
      rate: Joi.string(),
    },
  }),
  async (req: Request, res: Response) => {
    const rate: string = req.params["rate"] || "";
    const rateService = Container.get(RateService);
    const result = await rateService.getConversionRate({ rate });
    return new SuccessResponse("Success", result).send(res);
  }
);
router.get(
  "/prices",
  celebrate({
    [Segments.QUERY]: {
      pairName: Joi.string().required(),
      operation: Joi.string().required(),
      amount: Joi.number().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const { pairName, operation, amount } = req.params;
    return new SuccessResponse("Success", {}).send(res);
  }
);
router.use(errors());
export default router;
