"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertUser = void 0;
const cypher_1 = require("./cypher");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function InsertUser(Email, password) {
    const mongodb = require("mongodb").MongoClient;
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    function data() {
        const passwordAuth = password.substring(0, password.indexOf(process.env.NODE_ENV === "prod"
            ? process.env.PROD_PASSWORD_EARLY
            : process.env.PASSWORD_EARLY));
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                const document = {
                    Email: Email,
                    carteiras: [],
                    senha: (0, cypher_1.Cypher)(passwordAuth),
                };
                const financeDocument = {
                    Email: Email,
                    financialHistory: {
                        month: [0],
                        week: [0],
                        day: [0],
                        updateDate: "10/1/2000",
                    },
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
