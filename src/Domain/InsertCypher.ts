export async function InsertCypher(
  Email: string,
  key: string,
  hashedPassword: string
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  function data() {
    return new Promise<boolean>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        let query = { Email: Email };

        let newPass = { $set: { senha: hashedPassword } };

        dbo
          .collection("master")
          .updateOne(query, newPass, async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            resolve(Boolean(resultado.modifiedCount));

            banco.close();
          });
      });
    });
  }
  return await data();
}
