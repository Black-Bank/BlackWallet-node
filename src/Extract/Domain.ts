/* eslint-disable no-extra-boolean-cast */
import { Extract } from "./type";
import { BTCBlock, ETHBlock, ETHTxType, ITxETH, ITxService } from "./entities";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

interface IETHBalanceData {
  address: string;
  blockData: { amount: number; blockNumber: string };
}
export const ExtractDomain = async (
  transactionsResults: ITxService[],
  ETHPrice: number,
  BTCPrice: number,
  ETHBalanceData: IETHBalanceData[]
): Promise<Extract[]> => {
  if (transactionsResults.length === 0) {
    return [];
  }

  const validTransactions = transactionsResults.filter((transaction) => {
    const result = transaction.result;

    if (Array.isArray(result)) {
      return result.length > 0;
    } else {
      return (result as ETHTxType).result.length > 0;
    }
  });

  const extract = [];
  const convertETHFactor = 1000000000000000000;
  const convertBTCFactor = 100000000;
  validTransactions.forEach((wallets) => {
    if (wallets.type === "ETH") {
      const result = wallets.result as ETHTxType;
      const isContinue = !Boolean(
        result.result ===
          "Max rate limit reached, please use API Key for higher rate limit"
      );
      if (isContinue) {
        const response = result.result as ETHBlock[];
        response.forEach((tx: ITxETH) => {
          const transactionBlockNumber = tx.blockNumber;
          const transactionHash = tx.hash;
          const addressFrom = tx.from;
          const addressTo = tx.to;
          const transactionValue = Number(
            ((Number(tx.value) / convertETHFactor) * ETHPrice).toFixed(2)
          );

          const coinValue = Number(
            (Number(tx.value) / convertETHFactor).toFixed(18)
          );

          const weiTax = Number(tx.gasUsed) * Number(tx.gasPrice);
          const transactionTax = Number(
            ((weiTax / convertETHFactor) * ETHPrice).toFixed(2)
          );
          const transactionDate = new Date(Number(tx.timeStamp) * 1000);
          const confirmed = Boolean(Number(tx.confirmations) > 0);
          const txDataBalance = ETHBalanceData.find(
            (tx) => tx?.blockData?.blockNumber === transactionBlockNumber
          )?.blockData.amount;

          const txBalance = Number(
            (Number(txDataBalance) / convertETHFactor).toFixed(18)
          );

          const isSend = Boolean(addressFrom === wallets.address);

          const transactionData = {
            hash: transactionHash,
            type: "ETH",
            addressFrom: addressFrom,
            addressTo: addressTo,
            value: transactionValue,
            coinValue: isSend ? -coinValue : coinValue,
            confirmed: confirmed,
            date: transactionDate,
            fee: transactionTax,
            balance: txBalance,
          };
          extract.push(transactionData);
        });
      }
    } else if (wallets.type === "BTC") {
      const result = wallets.result as BTCBlock[];
      result.forEach((transaction) => {
        const transactionHash = transaction.txid;
        const addressFrom = transaction.vin[0].prevout.scriptpubkey_address;
        const objTo = transaction.vout.find(
          (vout) => vout.scriptpubkey_address !== addressFrom
        );
        const addressTo = objTo.scriptpubkey_address;
        const transactionValue = Number(
          ((Number(objTo.value) * BTCPrice) / convertBTCFactor).toFixed(2)
        );
        const transactionTax = Number(
          ((Number(transaction.fee) * BTCPrice) / convertBTCFactor).toFixed(2)
        );
        const transactionDate = new Date(
          Number(transaction.status.block_time) * 1000
        );

        const prevoutSatoshiValue = transaction.vin.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.prevout.value,
          0
        );

        const prevoutValue = Number(
          (prevoutSatoshiValue / convertBTCFactor).toFixed(9)
        );

        const coinValue = Number(
          (Number(transaction.fee) / convertBTCFactor).toFixed(9)
        );

        const isSend = Boolean(addressFrom === wallets.address);

        const transactionData = {
          hash: transactionHash,
          type: "BTC",
          addressFrom: addressFrom,
          addressTo: addressTo,
          value: isSend ? -transactionValue : transactionValue,
          coinValue: isSend ? -coinValue : coinValue,
          confirmed: transaction.status.confirmed,
          date: transactionDate,
          fee: transactionTax,
          prevout: prevoutValue,
        };
        extract.push(transactionData);
      });
    }
  });

  return extract;
};
