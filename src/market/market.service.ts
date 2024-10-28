import marketCapProvider from "./coinMarketCap.provider";

export default class MarketService {
    public static async getMarketValue({ currency }: { currency: string; }) {
        const response = await marketCapProvider.get<CoinMarketCapResponse>(`cryptocurrency/quotes/latest?symbol=BTC&convert=${currency}`);
        const price = response.data.data.BTC.quote[currency].price;
        const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(price);
        return { price, formattedPrice };
    }
}