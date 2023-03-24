export async function InsertCypher(
  HashId: string,
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
        let query = { idHash: "deg-hjags-123-212asdl" };

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
