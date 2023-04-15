"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
class Crypto {
    constructor(encryptionKey, decryptionKey, iv) {
        this.encryptionKey = encryptionKey;
        this.decryptionKey = decryptionKey;
        this.iv = iv;
    }
    encrypt(plaintext) {
        const key = crypto_js_1.default.enc.Hex.parse(this.encryptionKey);
        const iv = crypto_js_1.default.enc.Hex.parse(this.iv);
        const ciphertext = crypto_js_1.default.AES.encrypt(plaintext, key, { iv }).toString();
        return ciphertext;
    }
    decrypt(ciphertext) {
        const key = crypto_js_1.default.enc.Hex.parse(this.decryptionKey);
        const iv = crypto_js_1.default.enc.Hex.parse(this.iv);
        const bytes = crypto_js_1.default.AES.decrypt(ciphertext, key, { iv });
        const plaintext = bytes.toString(crypto_js_1.default.enc.Utf8);
        return plaintext;
    }
}
exports.default = Crypto;
