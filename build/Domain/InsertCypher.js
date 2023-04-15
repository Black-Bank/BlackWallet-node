"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertCypher = void 0;
const cypher_1 = require("./cypher");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function InsertCypher(Email, key, password) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
    function data() {
        const passwordAuth = password.substring(0, password.indexOf(process.env.PASSWORD_EARLY));
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { Email: Email };
                let newPass = { $set: { senha: (0, cypher_1.Cypher)(passwordAuth) } };
                dbo
                    .collection("master")
                    .updateOne(query, newPass, async (erro, resultado) => {
                    if (erro) {
                        throw erro;
                    }
                    resolve(Boolean(resultado.modifiedCount));
                    banco.close();
                });
            });
        });
    }
    return await data();
}
exports.InsertCypher = InsertCypher;
