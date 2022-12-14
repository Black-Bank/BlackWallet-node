import { Wallet } from "../entities/Wallet";

export async function InsertWallet(
  param: {
    name: string;
    address: string;
    privateKey: string;
  },
  HashId: string,
  key: string,
  lastWallet: any
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
  let result = [];
  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        let query = { idHash: HashId };
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
