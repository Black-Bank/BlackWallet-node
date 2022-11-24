import axios from "axios";
import Web3 from "web3";
import { CoinPrice } from "../../Domain/getCoinPrice";

export async function FormatedData(
  HashId: string,
  key: string,
  mainNet: string,
  API_KEY
) {
  const mongodb = require("mongodb").MongoClient;
  const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
  const sochain_network = "BTC";
  const web3 = new Web3(mainNet);

  let result = [];

  function data() {
    return new Promise<void>((resolve) => {
      mongodb.connect(url, (erro: { message: string }, banco: any) => {
        if (erro) {
          throw erro;
        }

        const dbo = banco.db("userInfo");
        let query = { idHash: HashId };

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
        const source_address = wallet.address;
        const sochain_url = `https://sochain.com/api/v2/get_address_balance/${sochain_network}/${source_address}`;
        const response = await axios.get(sochain_url);
        const coinPriceActual = await CoinPrice(API_KEY, "BTC");
        wallet.balance = Number(response?.data.data.confirmed_balance);
        wallet.coinPrice = coinPriceActual;
      } else if (wallet.WalletType === "ETH") {
        const source_address = wallet.address;
        let newBalance = await web3.eth.getBalance(source_address);
        const coinPriceActual = await CoinPrice(API_KEY, "ETH");
        wallet.balance = Number(newBalance);
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
