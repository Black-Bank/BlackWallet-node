"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertWallet = void 0;
function InsertWallet(param, HashId, key) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;
    mongodb.connect(url, (erro, banco) => {
        if (erro) {
            throw erro;
        }
        const dbo = banco.db("CFBcursos");
        let query = { idHash: HashId };
        let carteiras = [];
        dbo
            .collection("colecao")
            .find(query)
            .toArray((erro, resultado) => {
            if (erro) {
                throw erro;
            }
            carteiras.push(...resultado[0].carteiras, param);
        });
        let newWallet = { $set: { carteiras: carteiras } };
        dbo
            .collection("colecao")
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
