"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWallets = void 0;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function DeleteWallets(HashId, key, address) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { idHash: HashId };
                let deleteQuery = {
                    $pull: {
                        carteiras: { address: address },
                    },
                };
                dbo
                    .collection("master")
                    .updateOne(query, deleteQuery, async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    const res = resultado;
                    result.push(res);
                    console.log("carteira deletada");
                    resolve();
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
exports.DeleteWallets = DeleteWallets;
