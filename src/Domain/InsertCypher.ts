import { Cypher } from "./cypher";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function InsertCypher(Email: string, password: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  function data() {
    const passwordAuth = password.substring(
      0,
      password.indexOf(process.env.PASSWORD_EARLY)
    );
    return new Promise<boolean>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        let query = { Email: Email };

        let newPass = { $set: { senha: Cypher(passwordAuth) } };

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
