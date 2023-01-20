import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../utils/api-response";
import { NotFoundError } from "utils/api-error";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { pairName } = req.params;
  return new SuccessResponse("success", {}).send(res);
});
router.get("/prices", async (req: Request, res: Response) => {
  const { pairName, operation, amount } = req.params;
  return new SuccessResponse("success", {}).send(res);
});

export default router;
