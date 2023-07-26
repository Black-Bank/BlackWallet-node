"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTokenLoaderERC20 = void 0;
const axios_1 = __importDefault(require("axios"));
const SendTokenLoaderERC20 = async (name, addressFrom, addressTo, contractAddress, contractFactor, amount, privateKey) => {
    const url = `${process.env.PROD_BASE_PAYMENT_URL}/balance/send`;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `${process.env.PROD_PAYMENT_AUTH_TOKEN}`,
    };
    const body = {
        name: name,
        addressFrom: addressFrom,
        addressTo: addressTo,
        contractAddress: contractAddress,
        contractFactor: contractFactor,
        amount: amount,
        privateKey: privateKey,
    };
    try {
        const response = await axios_1.default.get(url, { headers, data: body });
        return response.data;
    }
    catch (err) {
        throw new Error(`An Error Occurred ${err.message}`);
    }
};
exports.SendTokenLoaderERC20 = SendTokenLoaderERC20;
