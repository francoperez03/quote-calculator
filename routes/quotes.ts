import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../utils/api-response";
import { NotFoundError } from "utils/api-error";
import { celebrate, Joi, Segments, errors } from "celebrate";

const router = express.Router();

router.get(
  "/",
  celebrate({
    [Segments.QUERY]: {
      pairName: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const { pairName } = req.query;
    console.log(pairName);
    return new SuccessResponse("Success", {}).send(res);
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
