import { Response, Request } from "express";
import PaymentService from "./payment.service";

export default class PaymentController {
    public static async notifyPayment(req: Request, res: Response) {
        const { transactionId } = req.body;
        const response = await PaymentService.notifyPayment({ transactionId });
        res.status(200).send(response);
    }
}