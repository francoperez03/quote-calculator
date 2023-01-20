import { Router } from "express";
import orders from "./quotes";

const router = Router();
router.use("/orders", orders);

export default router;
