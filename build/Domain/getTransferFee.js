"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedBitcoinFee = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_1 = __importDefault(require("web3"));
const web3 = new web3_1.default("https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a");
async function getRecommendedBitcoinFee(coin) {
    const gasPrice = Number(await web3.eth.getGasPrice());
    if (coin === "ETH") {
        return {
            fatestFee: 21000 * gasPrice,
            MediumFee: 21000 * gasPrice,
            LowFee: 21000 * gasPrice,
            economicFee: 21000 * gasPrice,
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
        const minFee = 4319;
        return {
            fatestFee: recommendedFastestFee > minFee ? recommendedFastestFee : minFee,
            MediumFee: MediumFee > minFee ? MediumFee : minFee,
            LowFee: LowFee > minFee ? LowFee : minFee,
            economicFee: LowestFee > minFee ? LowestFee : minFee,
        };
    }
}
exports.getRecommendedBitcoinFee = getRecommendedBitcoinFee;
