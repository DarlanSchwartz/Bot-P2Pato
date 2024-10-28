import TelegramBot from 'node-telegram-bot-api';
import UsersService from "../users/users.service";
import MarketService from "../market/market.service";
import Utils from "../utils/utils";
import PaymentService from "../payments/payment.service";
const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });


const enum TransactionStage {
    AWAITING_AMOUNT = 0,
    AWAITING_WALLET_ADDRESS = 1,
    AWAITING_PAYMENT = 2,
    COMPLETED = 3
}
const onGoingChats: { chat_id: number, userId: number; stage: TransactionStage; amount_in_cents?: number, wallet_address?: string; }[] = [];

async function notifyPayment({ amount_in_cents, wallet_address, chat_id }: { chat_id: number, amount_in_cents: number, wallet_address: string; }) {
    const paymentValue = (amount_in_cents / 100);
    removeOnGoingChat(chat_id);
    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: "BRL" }).format(paymentValue);
    bot.sendMessage(chat_id, `Seu pagamento de ${formattedValue} para a carteira ${wallet_address} foi recebido com sucesso!`);

}

function extractNumber(str?: string) {
    if (!str) return null;
    const match = str.match(/\d+/); // \d+ matches one or more digits
    return match ? parseInt(match[0], 10) : null;
}

function updateOnGoingChat(chatId: number, userId: number, stage: TransactionStage, amount_in_cents?: number, wallet_address?: string) {
    const chat = onGoingChats.find(chat => chat.chat_id === chatId);
    if (!chat) return onGoingChats.push({ chat_id: chatId, userId, stage, amount_in_cents, wallet_address });
    chat.stage = stage;
    chat.amount_in_cents = amount_in_cents;
    chat.wallet_address = wallet_address;
    onGoingChats.map(chat => chat.chat_id === chatId ? chat : chat);
}

function removeOnGoingChat(chatId: number) {
    const index = onGoingChats.findIndex(chat => chat.chat_id === chatId);
    if (index !== -1) onGoingChats.splice(index, 1);

}

async function greetUser({ first_name, last_name, chatId, userId }: { first_name: string, last_name: string, chatId: number, userId: number; }) {
    const exists = await UsersService.getUser({ telegram_id: userId.toString() });

    if (!exists) {
        await UsersService.createUser({ telegram_id: userId.toString(), first_name, last_name });
        onGoingChats.push({ chat_id: chatId, userId, stage: TransactionStage.AWAITING_AMOUNT });
        MarketService.getMarketValue({ currency: "BRL" }).then(async (quotation) => {
            bot.sendMessage(chatId, "O valor do Bitcoin agora é de " + quotation.formattedPrice);
        });
        return bot.sendMessage(chatId, `Olá, seja bem vindo ${first_name} meu nome é Algumacoisa, sou um Bot da Bee2P, estou aqui para te auxiliar a comprar seus Bitcoins de forma segura e privada. Para prosseguirmos me informe a quantidade em reais que você deseja comprar de Bitcoin`);
    }

    const toProceedText = "Para prosseguirmos me informe a quantidade em reais que você deseja comprar de Bitcoin.";
    bot.sendMessage(chatId, `Olá, novamente ${first_name}, que bom te ver por aqui! Estou aqui para te auxiliar a comprar seus Bitcoins de forma segura e privada.\n\n${toProceedText}\n\nExemplo: \n\nEu quero comprar: 1000\n\n1000 \n\ncomprar 1000`);
    onGoingChats.push({ chat_id: chatId, userId, stage: TransactionStage.AWAITING_AMOUNT });
    MarketService.getMarketValue({ currency: "BRL" }).then(async (quotation) => {
        bot.sendMessage(chatId, "O valor do Bitcoin agora é de " + quotation.formattedPrice);
    });
}

async function handlePaymentAmount({ chatId, userId, msg }: { chatId: number, userId: number, msg: TelegramBot.Message; }) {
    const value = extractNumber(msg?.text);
    const isAPurchaseRequest = msg.text?.includes("quero") && msg.text?.includes("comprar") || msg.text?.includes("comprar") && !!value || !!value;
    if (isAPurchaseRequest) {
        const value = extractNumber(msg?.text);
        if (!value) return bot.sendMessage(chatId, `Não consegui identificar o valor que você deseja comprar, por favor, tente novamente.`);
        if (value < 100) return bot.sendMessage(chatId, `O valor mínimo para compra é de R$ 100,00`);
        const quotation = await MarketService.getMarketValue({ currency: "BRL" });
        const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: "BRL" }).format(value);
        const conversion = `O valor de ${formattedPrice} convertido para Bitcoin é de ${(value / quotation.price).toFixed(8)} BTC`;
        const yesMessage = `Se sim, por favor, me informe o seu endereço da sua carteira Lighting Network para que eu possa gerar um código PIX copia e cola para você.`;
        const currentBTCPriceText = `O valor do Bitcoin agora é de ${quotation.formattedPrice}`;
        const theValueWillBeConverted = `O valor ${formattedPrice} será convertido em Bitcoin e enviado para o endereço de carteira que você informar.`;
        updateOnGoingChat(chatId, userId, TransactionStage.AWAITING_WALLET_ADDRESS, value * 100);
        return bot.sendMessage(chatId, `Você deseja comprar ${formattedPrice} em Bitcoin, correto?\n\n${yesMessage}\n\n${theValueWillBeConverted}\n\n${currentBTCPriceText}\n\n${conversion}`);
    }
    if (!isAPurchaseRequest) bot.sendMessage(chatId, `Não consegui identificar o valor que você deseja comprar, por favor, tente novamente.`);
}

async function handlePayment({ chatId, userId, msg }: { chatId: number, userId: number, msg: TelegramBot.Message; }) {
    if (!msg.text) return bot.sendMessage(chatId, `Endereço de carteira inválido, por favor, tente novamente.`);
    const isWalletAddress = Utils.getWalletType(msg.text);
    if (!isWalletAddress) return bot.sendMessage(chatId, `Endereço de carteira inválido, por favor, tente novamente.`);
    const onGoingChat = onGoingChats.find(chat => chat.userId === userId && !!chat.amount_in_cents);
    if (!onGoingChat) return bot.sendMessage(chatId, `Não foi possível identificar a transação, por favor, tente novamente.`);
    if (!!onGoingChat.amount_in_cents) {
        const response = await PaymentService.createPayment({ telegram_id: userId.toString(), amount_in_cents: onGoingChat.amount_in_cents, wallet_address: msg.text, chat_id: chatId });
        updateOnGoingChat(chatId, userId, TransactionStage.AWAITING_PAYMENT, onGoingChat.amount_in_cents, isWalletAddress);
        await bot.sendMessage(chatId, `Obrigado por informar o endereço da sua carteira ${isWalletAddress}, seu código pix copia e cola é :`);
        bot.sendDocument(chatId, response.pixQRCode);
        return bot.sendMessage(chatId, response.pixCopyAndPaste);
    }
    return bot.sendMessage(chatId, `Não foi possível identificar a transação, por favor, tente novamente.`);
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? 0;
    const chatStage = onGoingChats.find(chat => chat.chat_id === chatId);
    switch (chatStage?.stage) {
        case TransactionStage.AWAITING_AMOUNT:
            return handlePaymentAmount({ chatId, userId, msg });
        case TransactionStage.AWAITING_WALLET_ADDRESS:
            return handlePayment({ chatId, userId, msg });
        case TransactionStage.AWAITING_PAYMENT:
            return bot.sendMessage(chatId, `Aguarde, estamos processando o seu pagamento.`);
        default:
            if (!!userId) {
                const first_name = msg.from?.first_name ?? "";
                const last_name = msg.from?.last_name ?? "";
                return greetUser({ first_name, last_name, chatId, userId });
            }
            return;
    }
});

export const BOT = {
    instance: bot,
    notifyPayment: notifyPayment
};