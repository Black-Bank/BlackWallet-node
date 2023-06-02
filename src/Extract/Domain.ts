import { Extract } from "./type";
import { BTCBlock, ETHTxType, ITxETH, ITxService } from "./entities";
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });

export const ExtractDomain = async (
  transactionsResults: ITxService[],
  ETHPrice: number,
  BTCPrice: number
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
  validTransactions.forEach((transaction) => {
    if (transaction.type === "ETH") {
      const result = transaction.result as ETHTxType;

      result.result.forEach((tx: ITxETH) => {
        const transactionHash = tx.hash;
        const addressFrom = tx.from;
        const addressTo = tx.to;
        const transactionValue = Number(
          ((Number(tx.value) / convertETHFactor) * ETHPrice).toFixed(2)
        );

        const weiTax = Number(tx.gasUsed) * Number(tx.gasPrice);
        const transactionTax = Number(
          ((weiTax / convertETHFactor) * ETHPrice).toFixed(2)
        );
        const transactionDate = new Date(Number(tx.timeStamp) * 1000);
        const confirmed = Boolean(Number(tx.confirmations) > 0);
        const transactionData = {
          hash: transactionHash,
          type: "ETH",
          addressFrom: addressFrom,
          addressTo: addressTo,
          value: transactionValue,
          confirmed: confirmed,
          date: transactionDate,
          fee: transactionTax,
        };
        extract.push(transactionData);
      });
    } else if (transaction.type === "BTC") {
      const result = transaction.result as BTCBlock[];
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
        const transactionData = {
          hash: transactionHash,
          type: "BTC",
          addressFrom: addressFrom,
          addressTo: addressTo,
          value: transactionValue,
          confirmed: transaction.status.confirmed,
          date: transactionDate,
          fee: transactionTax,
        };
        extract.push(transactionData);
      });
    }
  });

  return extract;
};
