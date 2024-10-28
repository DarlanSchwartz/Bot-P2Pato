import axios from "axios";

const marketCapProvider = axios.create({
    baseURL: "https://pro-api.coinmarketcap.com/v1",
    headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY_COIN_MARKET_CAP
    }
});

export default marketCapProvider;