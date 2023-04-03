"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const bcrypt = require("bcryptjs");
async function AuthUser(Email, key, password) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
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
                    bcrypt.compare(password, resultado.senha, function (err, AuthResponse) {
                        if (err)
                            throw err;
                        resolve(Boolean(AuthResponse));
                    });
                    banco.close();
                });
            });
        });
    }
    return await data();
}
exports.AuthUser = AuthUser;
