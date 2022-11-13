"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertWallet = void 0;
function InsertWallet(param, HashId, key, lastWallet) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://${key}@cluster0.aqzkkfe.mongodb.net/?retryWrites=true&w=majority`;
    mongodb.connect(url, (erro, banco) => {
        if (erro) {
            throw erro;
        }
        const dbo = banco.db("userInfo");
        let query = { idHash: HashId };
        lastWallet.push(param);
        console.log(key);
        let newWallet = { $set: { carteiras: lastWallet } };
        dbo
            .collection("master")
            .updateOne(query, newWallet, async (erro, resultado) => {
            if (erro) {
                throw erro;
            }
            console.log("carteira adicionada");
            banco.close();
        });
    });
}
exports.InsertWallet = InsertWallet;
