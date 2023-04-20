"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindWallets = void 0;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function FindWallets(Email) {
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
                let query = { Email: Email };
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
