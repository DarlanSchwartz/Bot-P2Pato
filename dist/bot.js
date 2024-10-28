"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyPayment = notifyPayment;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const BOT_TOKEN = (_a = process.env.BOT_TOKEN) !== null && _a !== void 0 ? _a : "";
const bot = new node_telegram_bot_api_1.default(BOT_TOKEN, { polling: true });
const Messages = {};
const options = [
    {
        text: "Análise da saúde da plantação",
    },
    {
        text: "Análise meteorologia por inteligência Artificial",
    }
];
function notifyPayment() {
    return __awaiter(this, arguments, void 0, function* (userId = "", amountInCents = 0, walletAddress = "") {
        const chatId = userId;
        const message = `Pagamento de R$ ${amountInCents / 100} recebido com sucesso!
        O valor de R$ ${amountInCents / 100} foi recebido na carteira ${walletAddress}!
    `;
        bot.sendMessage(chatId, message);
    });
}
/**
 *  bot.sendPoll(chatId, "Você tem interesse em realizar algum dos serviços abaixo: ", options, {
                    allows_multiple_answers: false
                });
 */
/**
 *  bot.sendMessage(chatId, Messages.afterGreetings);
 */
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
});
