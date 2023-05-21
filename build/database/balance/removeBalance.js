"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveBalance = void 0;
function RemoveBalance(HashId, key, removeOption) {
    const mongodb = require("mongodb").MongoClient;
    const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
    mongodb.connect(url, (erro, banco) => {
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
        }
        else if (removeOption === "week") {
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
        }
        else if (removeOption === "day") {
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
exports.RemoveBalance = RemoveBalance;
