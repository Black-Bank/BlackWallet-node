"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUser = void 0;
async function hasUser(Email, key) {
    const mongodb = require("mongodb").MongoClient;
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                dbo
                    .collection("master")
                    .findOne({ Email: Email }, async (erro, resultado) => {
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
exports.hasUser = hasUser;
