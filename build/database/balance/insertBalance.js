"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertBalance = void 0;
function InsertBalance(HashId, key, insertOption, newBalance, lastBalance) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://${key}@cluster0.im4zqou.mongodb.net/?retryWrites=true&w=majority`;
    mongodb.connect(url, async (erro, banco) => {
        if (erro) {
            throw erro;
        }
        let financialData = [];
        const dbo = banco.db("BlackNodeDB");
        let query = { idHash: HashId };
        const dayLimit = 7;
        const weekLimit = 4;
        const monthLimit = 6;
        function monthProcess() {
            if (lastBalance.month.length >= monthLimit) {
                lastBalance.month.shift();
                lastBalance.month.push(lastBalance.week[0]);
            }
            else {
                lastBalance.month.push(lastBalance.week[0]);
            }
        }
        function weekProcess() {
            if (lastBalance.week.length >= weekLimit) {
                monthProcess();
                lastBalance.week.shift();
                lastBalance.week.push(lastBalance.day[0]);
            }
            else {
                lastBalance.week.push(lastBalance.day[0]);
            }
        }
        function dayProcess() {
            if (lastBalance.day.length >= dayLimit) {
                weekProcess();
                lastBalance.day.shift();
                lastBalance.day.push(newBalance);
            }
            else {
                lastBalance.day.push(newBalance);
            }
        }
        dayProcess();
        console.log(lastBalance);
        let newData = {
            $set: {
                financialHistory: lastBalance,
            },
        };
        dbo
            .collection("TotalBalance")
            .updateOne(query, newData, async (erro, resultado) => {
            if (erro) {
                throw erro;
            }
            banco.close();
        });
    });
}
exports.InsertBalance = InsertBalance;
