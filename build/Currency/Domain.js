"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDollarPriceInReais = void 0;
const axios_1 = __importDefault(require("axios"));
async function getExchangeRate() {
    try {
        const response = await axios_1.default.get("https://api.exchangerate-api.com/v4/latest/USD");
        const exchangeRate = response.data.rates.BRL;
        return exchangeRate;
    }
    catch (error) {
        console.error("Erro ao obter a taxa de câmbio:", error);
        throw error;
    }
}
async function getDollarPriceInReais() {
    try {
        const exchangeRate = await getExchangeRate();
        const dollarPrice = exchangeRate;
        return { Price: dollarPrice };
    }
    catch (error) {
        throw error;
    }
}
exports.getDollarPriceInReais = getDollarPriceInReais;
