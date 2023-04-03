"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertUser = void 0;
async function InsertUser(Email, key, hashedPassword) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                const document = { Email: Email, carteiras: [], senha: hashedPassword };
                const financeDocument = {
                    Email: Email,
                    financialHistory: { month: [0], week: [0], day: [0] },
                };
                dbo
                    .collection("financialData")
                    .insertOne(financeDocument, async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    resolve(Boolean(resultado));
                });
                dbo
                    .collection("master")
                    .insertOne(document, async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    resolve(Boolean(resultado));
                    banco.close();
                });
            });
        });
    }
    return await data();
}
exports.InsertUser = InsertUser;
