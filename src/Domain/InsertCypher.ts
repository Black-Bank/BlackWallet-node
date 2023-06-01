import { Cypher } from "./cypher";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function InsertCypher(Email: string, password: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;

  function data() {
    const passwordAuth = password.substring(
      0,
      password.indexOf(
        process.env.NODE_ENV === "prod"
          ? process.env.PROD_PASSWORD_EARLY
          : process.env.PASSWORD_EARLY
      )
    );
    return new Promise<boolean>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        const query = { Email: Email };

        const newPass = { $set: { senha: Cypher(passwordAuth) } };

        dbo
          .collection("master")
          .updateOne(query, newPass, async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            console.log("change", Boolean(resultado.modifiedCount));
            resolve(Boolean(resultado.modifiedCount));

            banco.close();
          });
      });
    });
  }
  return await data();
}
