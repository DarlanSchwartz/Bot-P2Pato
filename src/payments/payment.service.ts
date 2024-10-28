import { BOT } from "../bot/bot";
import PaymentRepository from "./payments.repository";
import { PaymentStatus } from "./payment.types";
import UsersRepository from "../users/users.repository";

export default class PaymentService {
    public static async notifyPayment({ transactionId }: { transactionId: string; }) {
        const payment = await PaymentRepository.getPaymentTransactionId(transactionId);
        if (!payment) throw new Error("Payment not found");
        if (payment.status !== PaymentStatus.PENDING) return "OK";
        const { amount_in_cents, wallet_address, chat_id } = payment;
        await BOT.notifyPayment({ amount_in_cents, wallet_address, chat_id: parseInt(chat_id) });
        return "OK";
    }

    public static async createPayment({ telegram_id, amount_in_cents, wallet_address, chat_id }: { telegram_id: string, amount_in_cents: number, wallet_address: string; chat_id: number; }) {
        const randomUUID = crypto.randomUUID();
        const response = { data: { transactionId: randomUUID } };//!FIX This is a mock response
        const transaction_id = response.data.transactionId;
        const user = await UsersRepository.getUser({ telegram_id });
        if (!user) throw new Error("User not found");
        return PaymentRepository.createPayment({ user_id: user.id, amount_in_cents, wallet_address, transaction_id, chat_id });
    }
}