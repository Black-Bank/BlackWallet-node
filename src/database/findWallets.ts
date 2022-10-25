export async function FindWallets(HashId: string, key: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;

  let result = [];

  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("BlackNodeDB");
        let query = { idHash: HashId };

        dbo
          .collection("node")
          .find(query)
          .toArray(async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            const res = resultado;
            result.push(res[0].carteiras);
            resolve();
            banco.close();
          });
      });
    });
  }

  async function ReturnData() {
    await data();
    return result[0];
  }
  return await ReturnData();
}
