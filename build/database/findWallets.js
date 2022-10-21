"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindWallets = void 0;
async function FindWallets(HashId, key) {
    const mongodb = require("mongodb").MongoClient;
    const url = process.env.MONGODB_URI
        ? process.env.MONGODB_URI
        : `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("CFBcursos");
                let query = { idHash: HashId };
                dbo
                    .collection("colecao")
                    .find(query)
                    .toArray(async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    const res = resultado;
                    result.push(res[0].carteiras);
                    resolve();
                    banco.close();
                });
            });
        });
    }
    async function ReturnData() {
        await data();
        return result[0];
    }
    return await ReturnData();
}
exports.FindWallets = FindWallets;
