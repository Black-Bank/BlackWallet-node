export function InsertWallet(
  param: {
    name: string;
    address: string;
    privateKey: string;
  },
  HashId: string,
  key: string
) {
  const mongodb = require("mongodb").MongoClient;
  const url = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("BlackNodeDB");
    let query = { idHash: HashId };

    let carteiras = [];

    dbo
      .collection("node")
      .find(query)
      .toArray((erro, resultado) => {
        if (erro) {
          throw erro;
        }
        carteiras.push(...resultado[0].carteiras, param);
      });

    let newWallet = { $set: { carteiras: carteiras } };
    dbo
      .collection("node")
      .updateOne(query, newWallet, async (erro, resultado) => {
        if (erro) {
          throw erro;
        }
        console.log("carteira adicionada");
        banco.close();
      });
  });
}
