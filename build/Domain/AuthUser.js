"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const bcrypt = require("bcryptjs");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function AuthUser(Email, password) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
  const passwordAuth = password.substring(
    0,
    password.indexOf(process.env.PASSWORD_EARLY)
  );
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
            bcrypt.compare(
              passwordAuth,
              resultado.senha,
              function (err, AuthResponse) {
                if (err) throw err;
                resolve(Boolean(AuthResponse));
              }
            );
            banco.close();
          });
      });
    });
  }
  return await data();
}
exports.AuthUser = AuthUser;
