import axios from "axios";
import Web3 from "web3";
import { CoinPrice } from "../../Domain/getCoinPrice";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
export async function FormatedData(Email: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;

  const web3 = new Web3(process.env.ETH_MAINNET);
  let result = [];

  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }

        const dbo = banco.db("userInfo");
        let query = { Email: Email };

        dbo
          .collection("master")
          .find(query)
          .toArray(async (erro, resultado) => {
            if (erro) {
              console.log("err", erro);
              throw erro;
            }
            const res = resultado;
            result.push(res[0]?.carteiras);
            resolve();
            banco.close();
          });
      });
    });
  }

  async function ReturnData() {
    await data();
    for (let i = 0; i < result[0].length; i++) {
      const wallet = result[0][i];
      if (wallet.WalletType === "BTC") {
        const convertFactor = 100000000;
        const source_address = wallet.address;
        const newBalance = await axios.get(
          `https://api.blockcypher.com/v1/btc/main/addrs/${source_address}/balance`
        );
        const coinPriceActual = await CoinPrice("BTC");

        wallet.balance = Number(
          newBalance?.data.final_balance / convertFactor
        ).toFixed(10);
        wallet.coinPrice = coinPriceActual;
      } else if (wallet.WalletType === "ETH") {
        const convertFactor = 1000000000000000000;
        const source_address = wallet.address;
        let newBalance = await web3.eth.getBalance(source_address);
        const coinPriceActual = await CoinPrice("ETH");
        wallet.balance = (Number(newBalance) / convertFactor).toFixed(6);
        wallet.coinPrice = coinPriceActual;
      }
    }

    const totalBalance = result[0]
      .map((data) => data.balance * data.coinPrice)
      .reduce((total, actual) => total + actual);
    result[0].map((data) => (data.totalBalance = totalBalance));
    return result[0];
  }
  return await ReturnData();
}
