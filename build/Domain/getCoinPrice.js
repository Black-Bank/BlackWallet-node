"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinPrice = void 0;
const axios_1 = __importDefault(require("axios"));
async function CoinPrice(API_KEY, coin) {
    let priceInfo = 0;
    if (coin === "BTC") {
        const getPrice_url = `https://chain.so/api/v2/get_price/BTC/USD`;
        const response = await axios_1.default.get(getPrice_url);
        let exchangeArray = response === null || response === void 0 ? void 0 : response.data.data.prices;
        exchangeArray.map((data) => (priceInfo += Number(data.price)));
        return Number((priceInfo / exchangeArray.length).toFixed(2));
    }
    else if (coin === "ETH") {
        const getPrice_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
        const response = await axios_1.default.get(getPrice_url, {
            headers: {
                "X-CMC_PRO_API_KEY": API_KEY,
            },
        });
        let coinInfo = response.data.data.filter((data) => data.symbol === coin);
        let coinPrice = Number(coinInfo[0].quote.USD.price.toFixed(2));
        return coinPrice;
    }
}
exports.CoinPrice = CoinPrice;
