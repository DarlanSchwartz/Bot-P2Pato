import prisma from "../database/config";
import { PaymentStatus } from "./payment.types";

export default class PaymentRepository {
    static async getPaymentTransactionId(transaction_id: string) {
        const response = await prisma.payments.findUnique({
            where: { transaction_id }
        });
        return response;
    }

    public static async createPayment({ user_id, amount_in_cents, wallet_address, transaction_id, chat_id }: { user_id: number, amount_in_cents: number, wallet_address: string; chat_id: number; transaction_id: string; }) {
        const payment = await prisma.payments.create({
            data: {
                user_id,
                amount_in_cents,
                wallet_address,
                status: PaymentStatus.PENDING,
                transaction_id,
                chat_id: chat_id.toString()
            }
        });
        return payment;
    }
}