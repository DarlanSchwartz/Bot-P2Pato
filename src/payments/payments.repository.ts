import prisma from "../database/config";
import { PaymentStatus } from "./payment.types";

export default class PaymentRepository {
    static async getPaymentTransactionId(transaction_id: string) {
        const response = await prisma.payments.findUnique({
            where: { transaction_id }
        });
        return response;
    }

    static async updatePaymentStatus(transaction_id: string, status: PaymentStatus) {
        return prisma.payments.update({
            where: { transaction_id },
            data: { status }
        });
    }

    public static async createPayment({ user_id, amount_in_cents, wallet_address, transaction_id, chat_id, pix_copy_and_paste }: { user_id: number, amount_in_cents: number, wallet_address: string; chat_id: number; transaction_id: string; pix_copy_and_paste: string; }) {
        const payment = await prisma.payments.create({
            data: {
                user_id,
                amount_in_cents,
                wallet_address,
                status: PaymentStatus.PENDING,
                transaction_id,
                chat_id: chat_id.toString(),
                pix_copy_and_paste
            }
        });
        return payment;
    }
}