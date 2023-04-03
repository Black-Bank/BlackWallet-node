export async function hasUser(Email: string, key: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  function data() {
    return new Promise<boolean>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");

        dbo
          .collection("master")
          .findOne({ Email: Email }, async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            resolve(Boolean(resultado));
            banco.close();
          });
      });
    });
  }
  return await data();
}
