"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatedData = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_1 = __importDefault(require("web3"));
const getCoinPrice_1 = require("../../Domain/getCoinPrice");
async function FormatedData(HashId, key, mainNet) {
    const mongodb = require("mongodb").MongoClient;
    const url = `mongodb+srv://CreditBlack:${key}@cluster0.yfsjwse.mongodb.net/?retryWrites=true&w=majority`;
    const web3 = new web3_1.default(mainNet);
    let result = [];
    function data() {
        return new Promise((resolve) => {
            mongodb.connect(url, (erro, banco) => {
                if (erro) {
                    throw erro;
                }
                const dbo = banco.db("userInfo");
                let query = { idHash: HashId };
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
        await data();
        for (let i = 0; i < result[0].length; i++) {
            const wallet = result[0][i];
            if (wallet.WalletType === "BTC") {
                const convertFactor = 100000000;
                const source_address = wallet.address;
                const newBalance = await axios_1.default.get(`https://api.blockcypher.com/v1/btc/main/addrs/${source_address}/balance`);
                const coinPriceActual = await (0, getCoinPrice_1.CoinPrice)("BTC");
                wallet.balance = Number((newBalance === null || newBalance === void 0 ? void 0 : newBalance.data.balance) / convertFactor).toFixed(10);
                wallet.coinPrice = coinPriceActual;
            }
            else if (wallet.WalletType === "ETH") {
                const convertFactor = 1000000000000000000;
                const source_address = wallet.address;
                let newBalance = await web3.eth.getBalance(source_address);
                const coinPriceActual = await (0, getCoinPrice_1.CoinPrice)("ETH");
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
exports.FormatedData = FormatedData;
