import { paymentRouter } from "../payments/payment.routes";
import { healthRouter } from "./health.routes";
import { Router } from "express";

const mainRouter = Router();

mainRouter.use(paymentRouter);
mainRouter.use(healthRouter);

export { mainRouter };