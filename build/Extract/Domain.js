"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractDomain = void 0;
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
const ExtractDomain = async (transactionsResults, ETHPrice, BTCPrice, ETHBalanceData) => {
    if (transactionsResults.length === 0) {
        return [];
    }
    const validTransactions = transactionsResults.filter((transaction) => {
        const result = transaction.result;
        if (Array.isArray(result)) {
            return result.length > 0;
        }
        else {
            return result.result.length > 0;
        }
    });
    const extract = [];
    const convertETHFactor = 1000000000000000000;
    const convertBTCFactor = 100000000;
    validTransactions.forEach((wallets) => {
        if (wallets.type === "ETH") {
            const result = wallets.result;
            const isContinue = !Boolean(result.result ===
                "Max rate limit reached, please use API Key for higher rate limit");
            if (isContinue) {
                const response = result.result;
                response.forEach((tx) => {
                    var _a;
                    const transactionBlockNumber = tx.blockNumber;
                    const transactionHash = tx.hash;
                    const addressFrom = tx.from;
                    const addressTo = tx.to;
                    const transactionValue = Number(((Number(tx.value) / convertETHFactor) * ETHPrice).toFixed(2));
                    const coinValue = Number((Number(tx.value) / convertETHFactor).toFixed(18));
                    const weiTax = Number(tx.gasUsed) * Number(tx.gasPrice);
                    const transactionTax = Number(((weiTax / convertETHFactor) * ETHPrice).toFixed(2));
                    const transactionDate = new Date(Number(tx.timeStamp) * 1000);
                    const confirmed = Boolean(Number(tx.confirmations) > 0);
                    const txDataBalance = (_a = ETHBalanceData.find((tx) => { var _a; return ((_a = tx === null || tx === void 0 ? void 0 : tx.blockData) === null || _a === void 0 ? void 0 : _a.blockNumber) === transactionBlockNumber; })) === null || _a === void 0 ? void 0 : _a.blockData.amount;
                    const txBalance = Number((Number(txDataBalance) / convertETHFactor).toFixed(18));
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
        }
        else if (wallets.type === "BTC") {
            const result = wallets.result;
            result.forEach((transaction) => {
                const transactionHash = transaction.txid;
                const addressFrom = transaction.vin[0].prevout.scriptpubkey_address;
                const objTo = transaction.vout.find((vout) => vout.scriptpubkey_address !== addressFrom);
                const addressTo = objTo.scriptpubkey_address;
                const transactionValue = Number(((Number(objTo.value) * BTCPrice) / convertBTCFactor).toFixed(2));
                const transactionTax = Number(((Number(transaction.fee) * BTCPrice) / convertBTCFactor).toFixed(2));
                const transactionDate = new Date(Number(transaction.status.block_time) * 1000);
                const prevoutSatoshiValue = transaction.vin.reduce((accumulator, currentValue) => accumulator + currentValue.prevout.value, 0);
                const prevoutValue = Number((prevoutSatoshiValue / convertBTCFactor).toFixed(9));
                const coinValue = Number((Number(transaction.fee) / convertBTCFactor).toFixed(9));
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
exports.ExtractDomain = ExtractDomain;
