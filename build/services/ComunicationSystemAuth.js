"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
class Crypto {
    encrypt(plaintext) {
        const key = crypto_js_1.default.enc.Hex.parse(process.env.NODE_ENV === "prod"
            ? process.env.PROD_AUTH_PRIVATE_KEY
            : process.env.AUTH_PRIVATE_KEY);
        const iv = crypto_js_1.default.enc.Hex.parse(process.env.NODE_ENV === "prod" ? process.env.PROD_IV : process.env.IV);
        const ciphertext = crypto_js_1.default.AES.encrypt(plaintext, key, { iv }).toString();
        return ciphertext;
    }
    decrypt(ciphertext) {
        const key = crypto_js_1.default.enc.Hex.parse(process.env.NODE_ENV === "prod"
            ? process.env.PROD_AUTH_PRIVATE_KEY
            : process.env.AUTH_PRIVATE_KEY);
        const iv = crypto_js_1.default.enc.Hex.parse(process.env.NODE_ENV === "prod" ? process.env.PROD_IV : process.env.IV);
        const bytes = crypto_js_1.default.AES.decrypt(ciphertext, key, { iv });
        const plaintext = bytes.toString(crypto_js_1.default.enc.Utf8);
        return plaintext;
    }
}
exports.default = Crypto;
