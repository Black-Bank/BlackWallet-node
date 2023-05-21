import axios from "axios";
import Web3 from "web3";
import { CoinPrice } from "../../Domain/getCoinPrice";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
export async function FormatedData(Email: string) {
  const mongodb = require("mongodb").MongoClient;
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;

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
    const coinPrices = await Promise.all([
      CoinPrice("BTC"),
      CoinPrice("ETH"),
      data(),
    ]);
    if (!Boolean(result[0].length)) {
      return [];
    }
    const coinBTCPriceActual = coinPrices[0];
    const coinETHPriceActual = coinPrices[1];
    for (let i = 0; i < result[0].length; i++) {
      const wallet = result[0][i];
      if (wallet.WalletType === "BTC") {
        const convertFactor = 100000000;
        const source_address = wallet.address;

        const balanceRequests = [
          axios.get(`https://blockchain.info/balance?active=${source_address}`),
          axios.get(`https://blockchain.info/unspent?active=${source_address}`),
        ];
        const [balanceResponse, unconfirmed_txs] = await Promise.all(
          balanceRequests
        );

        const totalUnconfirmedBalance = unconfirmed_txs?.data.unspent_outputs
          .filter((data) => data.confirmations < 1)
          .reduce((accumulator, utxo) => accumulator + utxo.value, 0);

        wallet.balance = Number(
          (balanceResponse.data[source_address].final_balance -
            totalUnconfirmedBalance) /
            convertFactor
        ).toFixed(10);

        wallet.coinPrice = coinBTCPriceActual;
        wallet.unconfirmedBalance = totalUnconfirmedBalance;
      } else if (wallet.WalletType === "ETH") {
        const convertFactor = 1000000000000000000;
        const source_address = wallet.address;
        let newBalance = await web3.eth.getBalance(source_address);
        wallet.unconfirmedBalance = 0;
        wallet.balance = (Number(newBalance) / convertFactor).toFixed(6);
        wallet.coinPrice = coinETHPriceActual;
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
