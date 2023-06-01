"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertWallet = void 0;
async function InsertWallet(param, Email, lastWallet) {
    const mongodb = require("mongodb").MongoClient;
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    const result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                const query = { Email: Email };
                lastWallet.push(param);
                const newWallet = { $set: { carteiras: lastWallet } };
                dbo
                    .collection("master")
                    .updateOne(query, newWallet, async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    const res = resultado;
                    result.push(res);
                    resolve();
                    console.log("carteira adicionada");
                    banco.close();
                });
            });
        });
    }
    async function Response() {
        await data();
        return Boolean(result.length);
    }
    return await Response();
}
exports.InsertWallet = InsertWallet;
