/* eslint-disable no-extra-boolean-cast */
import axios from "axios";
import { CoinPrice } from "../Domain/getCoinPrice";
import { Wallet } from "../entities/Wallet";
import { ExtractDomain } from "./Domain";
import Web3 from "web3";
const web3 = new Web3(
  "https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a"
);

const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
const mongodb = require("mongodb").MongoClient;

function handleWalletsData(Email: string) {
  return new Promise<Wallet[]>((resolve) => {
    mongodb.connect(url, (erro: { message: string }, banco) => {
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

export async function handleWalletsExtract(Email: string) {
  const wallets = await handleWalletsData(Email);

  const transactionsPromises = [];
  const coinPrices = await Promise.all([CoinPrice("BTC"), CoinPrice("ETH")]);
  const ETHPrice = coinPrices[1];
  const BTCPrice = coinPrices[0];
  const BTCWallets = wallets.filter((wallet) => wallet.WalletType === "BTC");
  const ETHWallets = wallets.filter((wallet) => wallet.WalletType === "ETH");
  const hasBTCWallets = Boolean(BTCWallets.length > 0);
  const hasETHWallets = Boolean(ETHWallets.length > 0);
  if (hasBTCWallets) {
    BTCWallets.forEach((wallet) => {
      const apiUrl = `https://mempool.space/api/address/${wallet.address}/txs`;
      const promise = axios.get(apiUrl);
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
      const promise = axios.get(apiUrl);
      const promiseWithAddress = {
        address: wallet.address,
        type: wallet.WalletType,
        promise,
      };
      transactionsPromises.push(promiseWithAddress);
    });
  }

  const walletETHBalance = [];

  const transactionsResults = await Promise.all(
    transactionsPromises.map((wallet) =>
      wallet.promise.then(async (response) => {
        const transactionData = {
          address: wallet.address,
          type: wallet.type,
          result: response.data,
        };
        if (transactionData.type === "ETH") {
          const promisesData = [];
          const txData = [];
          const isContinue = !Boolean(
            response.data.message === "No transactions found" ||
              response.data.message === "NOTOK"
          );
          if (isContinue) {
            response.data.result.forEach((transaction) => {
              const transactionPromiseBalance = web3.eth.getBalance(
                wallet.address,
                transaction.blockNumber
              );
              promisesData.push(transactionPromiseBalance);
              txData.push(transaction.blockNumber);
            });

            walletETHBalance.push({
              address: wallet.address,
              blockData: await Promise.all(promisesData),
              txData,
            });
          }
        }

        return transactionData;
      })
    )
  );

  const ethBalanceData = [];

  walletETHBalance.forEach((item) => {
    const { address, blockData, txData } = item;
    const balanceData = blockData.map((block, index) => {
      return {
        address: address,
        blockData: {
          amount: block,
          blockNumber: txData[index],
        },
      };
    });
    ethBalanceData.push(...balanceData);
  });

  return await ExtractDomain(
    transactionsResults,
    ETHPrice,
    BTCPrice,
    ethBalanceData
  );
}
