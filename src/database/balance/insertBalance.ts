import { Balance } from "../../entities/balance";

export function InsertBalance(
  HashId: string,
  key: string,
  newBalance: number,
  lastBalance: Balance
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  mongodb.connect(url, async (erro: { message: string }, banco: any) => {
    if (erro) {
      throw erro;
    }
    const dbo = banco.db("userInfo");
    let query = { idHash: HashId };
    const dayLimit = 7;
    const weekLimit = 4;
    const monthLimit = 6;

    function monthProcess() {
      if (lastBalance.month.length >= monthLimit) {
        lastBalance.month.shift();
        lastBalance.month.push(lastBalance.week[0]);
      } else {
        lastBalance.month.push(lastBalance.week[0]);
      }
    }

    function weekProcess() {
      if (lastBalance.week.length >= weekLimit) {
        monthProcess();
        lastBalance.week.shift();
        lastBalance.week.push(lastBalance.day[0]);
      } else {
        lastBalance.week.push(lastBalance.day[0]);
      }
    }

    function dayProcess() {
      const date = new Date();
      const actualYear = date?.getFullYear();
      const Month = date.getMonth() + 1;
      const day = date.getDate();
      lastBalance.updateDate = `${day}/${Month}/${actualYear}`;
      if (lastBalance.day.length >= dayLimit) {
        weekProcess();
        lastBalance.day.shift();
        lastBalance.day.push(newBalance);
      } else {
        lastBalance.day.push(newBalance);
      }
    }

    dayProcess();

    let newData = {
      $set: {
        financialHistory: lastBalance,
      },
    };
    dbo
      .collection("financialData")
      .updateOne(query, newData, async (erro, resultado) => {
        if (erro) {
          throw erro;
        }
        banco.close();
      });
  });
}
