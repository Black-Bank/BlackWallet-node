"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinPrice = void 0;
const axios_1 = __importDefault(require("axios"));
async function CoinPrice(coin) {
    try {
        const getPrice_url = `https://api.binance.com/api/v3/avgPrice?symbol=${coin}USDT`;
        const response = await axios_1.default.get(getPrice_url);
        const coinPrice = Number(response === null || response === void 0 ? void 0 : response.data.price);
        return coinPrice;
    }
    catch (err) {
        throw new Error(err.message);
    }
}
exports.CoinPrice = CoinPrice;
