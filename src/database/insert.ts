export function InsertWallet(
  param: {
    name: string;
    address: string;
    privateKey: string;
  },
  IdHash: string,
  key: string
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("CFBcursos");
    let query = { idHash: IdHash };

    let carteiras = [];

    dbo
      .collection("colecao")
      .find(query)
      .toArray((erro, resultado) => {
        if (erro) {
          throw erro;
        }
        carteiras.push(...resultado[0].carteiras, param);
      });

    let newWallet = { $set: { carteiras: carteiras } };
    dbo
      .collection("colecao")
      .updateOne(query, newWallet, async (erro, resultado) => {
        if (erro) {
          throw erro;
        }
        console.log("carteira adicionada");
        banco.close();
      });
  });
}
