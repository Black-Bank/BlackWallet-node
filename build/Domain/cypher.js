"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cypher = void 0;
const crypto = require("crypto");
function Cypher(text, criptoKey) {
    const iv = crypto.randomBytes(16);
    const algo = "aes-256-ctr";
    const cipher = crypto.createCipheriv(algo, criptoKey, iv);
    const crypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
    return `${iv.toString("hex")}:${crypted}`;
}
exports.Cypher = Cypher;
