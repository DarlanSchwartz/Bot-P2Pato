import { Router } from "express";
import { webhookMiddleware } from "../middlewares/webhook.middleware";
import PaymentController from "./payment.controller";

const paymentRouter = Router();

paymentRouter.post('/payments/pix', webhookMiddleware, PaymentController.notifyPayment);

export { paymentRouter };