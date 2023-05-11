"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatedData = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_1 = __importDefault(require("web3"));
const getCoinPrice_1 = require("../../Domain/getCoinPrice");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
async function FormatedData(Email) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${process.env.KEY_SECRET_MONGODB}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
    const web3 = new web3_1.default(process.env.ETH_MAINNET);
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { Email: Email };
                dbo
                    .collection("master")
                    .find(query)
                    .toArray(async (erro, resultado) => {
                    var _a;
                    if (erro) {
                        console.log("err", erro);
                        throw erro;
                    }
                    const res = resultado;
                    result.push((_a = res[0]) === null || _a === void 0 ? void 0 : _a.carteiras);
                    resolve();
                    banco.close();
                });
            });
        });
    }
    async function ReturnData() {
        const coinPrices = await Promise.all([
            (0, getCoinPrice_1.CoinPrice)("BTC"),
            (0, getCoinPrice_1.CoinPrice)("ETH"),
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
                const newBalance = await axios_1.default.get(`https://api.blockcypher.com/v1/btc/main/addrs/${source_address}/balance`);
                wallet.balance = Number((newBalance === null || newBalance === void 0 ? void 0 : newBalance.data.final_balance) / convertFactor).toFixed(10);
                wallet.coinPrice = coinBTCPriceActual;
                wallet.unconfirmedBalance = newBalance === null || newBalance === void 0 ? void 0 : newBalance.data.unconfirmed_balance;
            }
            else if (wallet.WalletType === "ETH") {
                const convertFactor = 1000000000000000000;
                const source_address = wallet.address;
                let newBalance = await web3.eth.getBalance(source_address);
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
exports.FormatedData = FormatedData;
