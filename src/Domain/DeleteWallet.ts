const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export async function DeleteWallets(HashId: string, key: string, address) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  let result = [];

  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }

        const dbo = banco.db("userInfo");
        let query = { idHash: HashId };
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
