"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindWallets = void 0;
async function FindWallets(HashId, key) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://${key}@cluster0.aqzkkfe.mongodb.net/?retryWrites=true&w=majority`;
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { idHash: HashId };
                dbo
                    .collection("master")
                    .find(query)
                    .toArray(async (erro, resultado) => {
                    var _a;
                    if (erro) {
                        throw erro;
                    }
                    const res = resultado;
                    result.push((_a = res[0]) === null || _a === void 0 ? void 0 : _a.carteiras);
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
