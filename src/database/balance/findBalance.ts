const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function FindBalance(Email: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;

  const result = [];
  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        const query = { Email: Email };

        dbo
          .collection("financialData")
          .find(query)
          .toArray(async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            const res = resultado;

            result.push(res[0]);
            resolve();
            banco.close();
          });
      });
    });
  }

  async function ReturnData() {
    await data();
    return result[0].financialHistory;
  }
  return await ReturnData();
}
