const bcrypt = require("bcryptjs");

export async function AuthUser(Email: string, key: string, password: string) {
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
            bcrypt.compare(
              password,
              resultado.senha,
              function (err, AuthResponse) {
                if (err) throw err;

                resolve(Boolean(AuthResponse));
              }
            );

            banco.close();
          });
      });
    });
  }
  return await data();
}
