"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWallets = void 0;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function DeleteWallets(Email, address) {
    const mongodb = require("mongodb").MongoClient;
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { Email: Email };
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
