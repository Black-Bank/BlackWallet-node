"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindBalance = void 0;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function FindBalance(Email) {
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
                dbo
                    .collection("financialData")
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
