"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindBalance = void 0;
async function FindBalance(HashId, key) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://${key}@cluster0.aqzkkfe.mongodb.net/?retryWrites=true&w=majority`;
  let result = [];
  function data() {
    return new Promise((resolve) => {
      mongodb.connect(url, (erro, banco) => {
        if (erro) {
          throw erro;
        }
        const dbo = banco.db("userInfo");
        let query = { idHash: HashId };
        dbo
          .collection("node")
          .find(query)
          .toArray(async (erro, resultado) => {
            if (erro) {
              throw erro;
            }
            const res = resultado;
            result.push(res[0].Balance);
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
exports.FindBalance = FindBalance;
