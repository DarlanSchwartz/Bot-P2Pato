import { BOT } from "../bot/bot";
import PaymentRepository from "./payments.repository";
import { PaymentStatus } from "./payment.types";
import UsersRepository from "../users/users.repository";
import Utils from "../utils/utils";
import axios from "axios";

export default class PaymentService {
    public static async notifyPayment({ transaction_id }: { transaction_id: string; }) {
        const payment = await PaymentRepository.getPaymentTransactionId(transaction_id);
        if (!payment) throw new Error("Payment not found");
        if (payment.status === PaymentStatus.APPROVED || payment.status === PaymentStatus.REJECTED) return "OK";
        const { amount_in_cents, wallet_address, chat_id } = payment;
        await BOT.notifyPayment({ amount_in_cents, wallet_address, chat_id: parseInt(chat_id) });
        await PaymentRepository.updatePaymentStatus(transaction_id, PaymentStatus.APPROVED);
        return "OK";
    }

    public static async createPayment({ telegram_id, amount_in_cents, wallet_address, chat_id }: { telegram_id: string, amount_in_cents: number, wallet_address: string; chat_id: number; }) {
        const response = await axios.post<{ transaction_id: string, pix_copy_paste: string, qr_code: string; link: string; }>(`${process.env.API_URL}/payment`, {
            amount_in_cents,
            wallet_address
        });

        const { pix_copy_paste, qr_code, transaction_id } = response.data;

        const user = await UsersRepository.getUser({ telegram_id });
        if (!user) throw new Error("User not found");
        await PaymentRepository.createPayment({ user_id: user.id, amount_in_cents, wallet_address, transaction_id, chat_id, pix_copy_and_paste: response.data.pix_copy_paste });
        return { pix_copy_paste, qr_code: Utils.getBase64Image(qr_code) };
    }
}