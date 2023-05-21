const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function DeleteWallets(Email: string, address?) {
  const mongodb = require("mongodb").MongoClient;
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;

  let result = [];

  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }

        const dbo = banco.db("userInfo");
        let query = { Email: Email };
        let deleteQuery = {
          $pull: {
            carteiras: { address: address },
          },
        };
        dbo
          .collection("master")
          .updateOne(query, deleteQuery, async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            const res = resultado;
            result.push(res);
            console.log("carteira deletada");
            resolve();
            banco.close();
          });
      });
    });
  }
  async function Response() {
    await data();
    return Boolean(result.length);
  }

  return await Response();
}
