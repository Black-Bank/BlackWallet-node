"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindBalance = void 0;
async function FindBalance(HashId, key) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("BlackNodeDB");
                let query = { idHash: HashId };
                dbo
                    .collection("TotalBalance")
                    .find(query)
                    .toArray(async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    const res = resultado;
                    result.push(res[0]);
                    resolve();
                    banco.close();
                });
            });
        });
    }
    async function ReturnData() {
        await data();
        return result[0].financialHistory;
    }
    return await ReturnData();
}
exports.FindBalance = FindBalance;
