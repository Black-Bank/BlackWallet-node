"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedBitcoinFee = void 0;
const axios_1 = __importDefault(require("axios"));
async function getRecommendedBitcoinFee(coin) {
    // Busca a taxa média atual em satoshis por byte
    if (coin === "ETH") {
        return {
            fatestFee: 0,
            MediumFee: 0,
            LowFee: 0,
            economicFee: 0,
        };
    }
    else {
        const satoshisPerByte = 150;
        const response = await axios_1.default.get("https://mempool.space/api/v1/fees/recommended");
        const fastestFee = response.data.fastestFee;
        const halfHourFee = response.data.halfHourFee;
        const lowFee = response.data.hourFee;
        const economicFee = response.data.economyFee;
        const recommendedFastestFee = Math.ceil(fastestFee * satoshisPerByte);
        const MediumFee = Math.ceil(halfHourFee * satoshisPerByte);
        const LowFee = Math.ceil(lowFee * satoshisPerByte);
        const LowestFee = Math.ceil(economicFee * satoshisPerByte);
        return {
            fatestFee: recommendedFastestFee,
            MediumFee: MediumFee,
            LowFee: LowFee,
            economicFee: LowestFee,
        };
    }
}
exports.getRecommendedBitcoinFee = getRecommendedBitcoinFee;
