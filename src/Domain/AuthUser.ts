const bcrypt = require("bcryptjs");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function AuthUser(Email: string, password: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;

  const passwordAuth = password.substring(
    0,
    password.indexOf(
      process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production"
        ? process.env.PROD_PASSWORD_EARLY
        : process.env.PASSWORD_EARLY
    )
  );

  function data() {
    return new Promise<boolean>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
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
