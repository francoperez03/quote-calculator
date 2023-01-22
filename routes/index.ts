import { Router } from "express";
import rates from "./rates";

const router = Router();
router.use("/rates", rates);

export default router;
