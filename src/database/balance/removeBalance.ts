export function RemoveBalance(
  HashId: string,
  key: string,
  removeOption: string
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.aqzkkfe.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("userInfo");
    let query = { idHash: HashId };
    if (removeOption === "month") {
      dbo
        .collection("financialData")
        .updateOne(query, { $pop: { month: -1 } }, async (erro, resultado) => {
          if (erro) {
            console.log(erro);
            throw erro;
          }
          console.log("Balance month removido");
          banco.close();
        });
    } else if (removeOption === "week") {
      dbo
        .collection("financialData")
        .updateOne(query, { $pop: { week: -1 } }, async (erro, resultado) => {
          if (erro) {
            console.log(erro);
            throw erro;
          }
          console.log("Balance week removido");
          banco.close();
        });
    } else if (removeOption === "day") {
      dbo
        .collection("financialData")
        .updateOne(query, { $pop: { day: -1 } }, async (erro, resultado) => {
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
