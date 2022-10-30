export function RemoveBalance(HashId: string, key: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("BlackNodeDB");
    let query = { idHash: HashId };
    dbo
      .collection("TotalBalance")
      .updateOne(query, { $pop: { month: 1 } }, async (erro, resultado) => {
        if (erro) {
          console.log(erro);
          throw erro;
        }
        console.log("Balance removido");
        banco.close();
      });
  });
}
