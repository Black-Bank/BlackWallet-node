"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceLoaderERC20 = void 0;
const axios_1 = __importDefault(require("axios"));
const Domain_1 = require("./Domain");
const BalanceLoaderERC20 = async (name, address, contractAddress, contractFactor, contractType) => {
    const url = `${process.env.BASE_PAYMENT_URL}/balance/total`;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `${process.env.PROD_PAYMENT_AUTH_TOKEN}`,
    };
    const body = {
        name: name,
        address: address,
        contractAddress: contractAddress,
        contractFactor: contractFactor,
        contractType: contractType,
    };
    try {
        const response = await axios_1.default.get(url, { headers, data: body });
        const value = response.data.value;
        return (0, Domain_1.getBalanceERC20)({ contractType, value });
    }
    catch (err) {
        throw new Error(`An Error Occurred ${err.message}`);
    }
};
exports.BalanceLoaderERC20 = BalanceLoaderERC20;
