export function RemoveBalance(
  HashId: string,
  key: string,
  removeOption: string
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("BlackNodeDB");
    let query = { idHash: HashId };
    if (removeOption === "month") {
      dbo
        .collection("TotalBalance")
        .updateOne(query, { $pop: { month: 1 } }, async (erro, resultado) => {
          if (erro) {
            console.log(erro);
            throw erro;
          }
          console.log("Balance month removido");
          banco.close();
        });
    } else if (removeOption === "week") {
      dbo
        .collection("TotalBalance")
        .updateOne(query, { $pop: { week: 1 } }, async (erro, resultado) => {
          if (erro) {
            console.log(erro);
            throw erro;
          }
          console.log("Balance week removido");
          banco.close();
        });
    } else if (removeOption === "day") {
      dbo
        .collection("TotalBalance")
        .updateOne(query, { $pop: { day: 1 } }, async (erro, resultado) => {
          if (erro) {
            console.log(erro);
            throw erro;
          }
          console.log("Balance day removido");
          banco.close();
        });
    }
  });
}
