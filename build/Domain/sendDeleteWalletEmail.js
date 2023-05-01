"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendDeleteWalletEmail = void 0;
const ComunicationSystemAuth_1 = __importDefault(require("../services/ComunicationSystemAuth"));
const emailjs = require("emailjs");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
const fs = require("fs");
const crypto = new ComunicationSystemAuth_1.default();
async function SendDeleteWalletEmail(destinatario) {
    const field = "ABCDEFGHIJKLMNOPQRSTUVWYXZ123456789";
    let codigoResgate = "";
    const codeLength = 6;
    for (let i = 0; i < codeLength; i++) {
        codigoResgate += field[Math.floor(Math.random() * field.length)];
    }
    const templatePath = path.resolve(__dirname, "..", "..", "EmailTemplates", "deleteWallet.html");
    const resgateSenhaHTML = fs.readFileSync(templatePath, "utf8");
    const server = emailjs.server.connect({
        user: "blackbankexecutive@gmail.com",
        password: process.env.APPGmailPass,
        host: "smtp.gmail.com",
        ssl: true,
        port: 465,
    });
    const message = {
        from: "Credit Black <blackbankexecutive@gmail.com>",
        to: destinatario,
        subject: "Código de deleção de carteira",
        attachment: [
            {
                data: resgateSenhaHTML.replace("[CODIGO_RESGATE]", codigoResgate),
                alternative: true,
            },
        ],
    };
    return new Promise((resolve, reject) => {
        server.send(message, (err, message) => {
            if (err) {
                reject({ code: "", isSend: false });
            }
            else {
                resolve({ code: crypto.encrypt(codigoResgate), isSend: true });
            }
        });
    });
}
exports.SendDeleteWalletEmail = SendDeleteWalletEmail;
