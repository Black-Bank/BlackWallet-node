export async function FindBalance(HashId: string, key: string) {
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
    console.log(result);
    return result[0].financialHistory;
  }
  return await ReturnData();
}
