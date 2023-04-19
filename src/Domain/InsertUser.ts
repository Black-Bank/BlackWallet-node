import { Cypher } from "./cypher";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
export async function InsertUser(Email: string, password: string) {
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
        const document = {
          Email: Email,
          carteiras: [],
          senha: Cypher(passwordAuth),
        };
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
