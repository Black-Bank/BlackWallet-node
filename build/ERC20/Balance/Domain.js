"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getERC20Wallet = exports.getBalanceERC20 = void 0;
const getBalanceERC20 = ({ contractType, value }) => {
    const response = { contractType, value };
    return response;
};
exports.getBalanceERC20 = getBalanceERC20;
const getERC20Wallet = async ({ email }) => {
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    const mongodb = require("mongodb").MongoClient;
    return new Promise((resolve) => {
        mongodb.connect(url, (erro, banco) => {
            if (erro) {
                resolve({});
            }
            const dbo = banco.db("userInfo");
            dbo
                .collection("master")
                .findOne({ Email: email }, async (erro, resultado) => {
                if (erro) {
                    throw erro;
                }
                if (Boolean(resultado)) {
                    resolve(resultado.DollarWallet);
                }
                banco.close();
            });
        });
    });
};
exports.getERC20Wallet = getERC20Wallet;
