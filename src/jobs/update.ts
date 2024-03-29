import Web3 from "web3";
import { CoinPrice } from "../Domain/getCoinPrice";
import axios from "axios";
import { InsertBalance } from "../database/balance/insertBalance";

const MongoClient = require("mongodb").MongoClient;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
const web3 = new Web3(process.env.ETH_MAINNET);

const prodURI = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
const dbName = "userInfo";
const collectionName = "master";
const collectionUpdateName = "financialData";

async function getDataFromMongoDB() {
  try {
    const prodClient = await MongoClient.connect(prodURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = prodClient.db(dbName);
    const collection = db.collection(collectionName);

    const projection = { Email: 1, carteiras: 1 };
    const data = await collection.find({}).project(projection).toArray();
    const dataList = data.filter((item) => item.carteiras.length > 0);
    const coinPrices = await Promise.all([CoinPrice("BTC"), CoinPrice("ETH")]);
    const coinBTCPriceActual = coinPrices[0];
    const coinETHPriceActual = coinPrices[1];
    const date = new Date();
    const actualYear = date?.getFullYear();
    const Month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${day}/${Month}/${actualYear}`;

    const calculateTotalBalance = async (carteiras): Promise<number> => {
      let totalBalance = 0;
      for (const carteira of carteiras) {
        if (carteira.WalletType === "BTC") {
          const convertFactor = 100000000;
          const source_address = carteira.address;

          const balanceRequests = [
            axios.get(
              `https://blockchain.info/balance?active=${source_address}`
            ),
            axios.get(
              `https://blockchain.info/unspent?active=${source_address}`
            ),
          ];
          const [balanceResponse, unconfirmed_txs] = await Promise.all(
            balanceRequests
          );

          const totalUnconfirmedBalance = unconfirmed_txs?.data.unspent_outputs
            .filter((data: { confirmations: number }) => data.confirmations < 1)
            .reduce(
              (accumulator, utxo: { value }) => accumulator + utxo.value,
              0
            );

          const balance = Number(
            (balanceResponse.data[source_address].final_balance -
              totalUnconfirmedBalance) /
              convertFactor
          ).toFixed(10);
          totalBalance += Number(balance) * coinBTCPriceActual;
        } else if (carteira.WalletType === "ETH") {
          const convertFactor = 1000000000000000000;
          const source_address = carteira.address;
          const newBalance = await web3.eth.getBalance(source_address);
          const balance = (Number(newBalance) / convertFactor).toFixed(6);
          totalBalance += coinETHPriceActual * Number(balance);
        }
      }
      return Number(totalBalance.toFixed(2));
    };

    const promisseResult = dataList.map(async (item) => {
      const email = item.Email;
      const totalBalance = await calculateTotalBalance(item.carteiras);
      return { email, totalBalance };
    });
    const result = await Promise.all(promisseResult);

    const emails = result.map((item) => item.email);

    const collectionUpdate = db.collection(collectionUpdateName);
    const filter = { Email: { $in: emails } };

    const documentsToUpdate = await collectionUpdate.find(filter).toArray();

    for (const document of documentsToUpdate) {
      const Email = document.Email;
      const lastIndex = document.financialHistory.day.length - 1;
      const totalBalance = result.find(
        (item) => item.email === Email
      ).totalBalance;
      const isNewDay = Boolean(today !== document.financialHistory.updateDate);
      if (isNewDay) {
        InsertBalance(Email, totalBalance, document.financialHistory);
      } else if (!isNewDay) {
        const updateArr = document.financialHistory.day.slice(0, lastIndex);

        const update = {
          $set: {
            "financialHistory.day": [...updateArr, totalBalance],
          },
        };

        await collectionUpdate.updateOne({ _id: document._id }, update);
      }
    }

    prodClient.close();
  } catch (error) {
    console.error("Ocorreu um erro ao obter os dados do MongoDB:", error);
  }
}

getDataFromMongoDB();
