const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
export async function InsertWallet(
  param: {
    name: string;
    address: string;
    privateKey: string;
  },
  Email: string,
  lastWallet: any
) {
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
        lastWallet.push(param);
        let newWallet = { $set: { carteiras: lastWallet } };

        dbo
          .collection("master")
          .updateOne(query, newWallet, async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            const res = resultado;
            result.push(res);
            resolve();
            console.log("carteira adicionada");
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
