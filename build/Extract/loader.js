"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWalletsExtract = void 0;
const axios_1 = __importDefault(require("axios"));
const getCoinPrice_1 = require("../Domain/getCoinPrice");
const Domain_1 = require("./Domain");
const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
const mongodb = require("mongodb").MongoClient;
function handleWalletsData(Email) {
  return new Promise((resolve) => {
    mongodb.connect(url, (erro, banco) => {
      if (erro) {
        throw erro;
      }
      const dbo = banco.db("userInfo");
      const query = { Email: Email };
      dbo
        .collection("master")
        .find(query)
        .toArray(async (erro, resultado) => {
          if (erro) {
            console.log("err", erro);
            throw erro;
          }
          resolve(resultado[0].carteiras);
          banco.close();
        });
    });
  });
}
async function handleWalletsExtract(Email) {
  const wallets = await handleWalletsData(Email);
  const transactionsPromises = [];
  const coinPrices = await Promise.all([
    (0, getCoinPrice_1.CoinPrice)("BTC"),
    (0, getCoinPrice_1.CoinPrice)("ETH"),
  ]);
  const ETHPrice = coinPrices[1];
  const BTCPrice = coinPrices[0];
  const BTCWallets = wallets.filter((wallet) => wallet.WalletType === "BTC");
  const ETHWallets = wallets.filter((wallet) => wallet.WalletType === "ETH");
  const hasBTCWallets = Boolean(BTCWallets.length > 0);
  const hasETHWallets = Boolean(ETHWallets.length > 0);
  if (hasBTCWallets) {
    BTCWallets.forEach((wallet) => {
      const apiUrl = `https://mempool.space/api/address/${wallet.address}/txs`;
      const promise = axios_1.default.get(apiUrl);
      const promiseWithAddress = {
        address: wallet.address,
        type: wallet.WalletType,
        promise,
      };
      transactionsPromises.push(promiseWithAddress);
    });
  }
  if (hasETHWallets) {
    ETHWallets.forEach((wallet) => {
      const randomNumber = Math.floor(Math.random() * 3);
      const API_KEY = !randomNumber
        ? process.env.ETH_SCAN_API_SORT_KEY
        : randomNumber > 1
        ? process.env.ETH_SCAN_API_KEY
        : process.env.ETH_SCAN_API_SECOUND_KEY;
      const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&apikey=${API_KEY}`;
      const promise = axios_1.default.get(apiUrl);
      const promiseWithAddress = {
        address: wallet.address,
        type: wallet.WalletType,
        promise,
      };
      transactionsPromises.push(promiseWithAddress);
    });
  }
  const transactionsResults = await Promise.all(
    transactionsPromises.map((transaction) =>
      transaction.promise.then((response) => ({
        address: transaction.address,
        type: transaction.type,
        result: response.data,
      }))
    )
  );
  return await (0, Domain_1.ExtractDomain)(
    transactionsResults,
    ETHPrice,
    BTCPrice
  );
}
exports.handleWalletsExtract = handleWalletsExtract;
