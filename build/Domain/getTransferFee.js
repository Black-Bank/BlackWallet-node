"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedBitcoinFee = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_1 = __importDefault(require("web3"));
const bitcore = __importStar(require("bitcore-lib"));
const ComunicationSystemAuth_1 = __importDefault(require("../services/ComunicationSystemAuth"));
const web3 = new web3_1.default("https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a");
const crypto = new ComunicationSystemAuth_1.default();
async function getRecommendedBitcoinFee(coin, addressFrom, addressTo, value, privateKey) {
    const gasPrice = Number(await web3.eth.getGasPrice());
    if (coin === "ETH") {
        return {
            fatestFee: 21000 * gasPrice,
            MediumFee: 21000 * gasPrice,
            LowFee: 21000 * gasPrice,
            economicFee: 21000 * gasPrice,
        };
    }
    else {
        // Get UTXOs of the sender address
        const utxosResponse = await axios_1.default.get(`https://blockchain.info/unspent?active=${addressFrom}`);
        const utxos = utxosResponse.data.unspent_outputs;
        if (!utxos || utxos.length === 0) {
            throw new Error("No UTXOs found for the sender address.");
        }
        // Convert UTXOs to bitcore format
        const bitcoreUtxos = utxos.map((utxo) => new bitcore.Transaction.UnspentOutput({
            txid: utxo.tx_hash_big_endian,
            vout: utxo.tx_output_n,
            scriptPubKey: new bitcore.Script(utxo.script),
            satoshis: utxo.value,
        }));
        // Create a transaction builder
        const txb = new bitcore.Transaction();
        // Add inputs to the transaction builder
        let inputAmount = 0;
        bitcoreUtxos.forEach((utxo) => {
            txb.from(utxo);
            inputAmount += utxo.satoshis;
        });
        // Calculate output amount and add recipient output
        const convertFactor = 100000000;
        const outputAmount = Math.floor(value * convertFactor);
        txb.to(addressTo, outputAmount);
        // Sign inputs with sender private key
        bitcoreUtxos.forEach(() => {
            const PrivateKey = new bitcore.PrivateKey(crypto.decrypt(privateKey));
            txb.sign(PrivateKey);
        });
        const transactionHex = txb.serialize();
        // Calcular o tamanho real da transação em bytes
        const transactionSizeBytes = transactionHex.length / 2;
        const response = await axios_1.default.get("https://mempool.space/api/v1/fees/recommended");
        const fastestFee = response.data.fastestFee;
        const halfHourFee = response.data.halfHourFee;
        const minimumFee = response.data.hourFee;
        const recommendedFastestFee = Math.ceil(fastestFee * transactionSizeBytes);
        const MediumFee = Math.ceil(halfHourFee * transactionSizeBytes);
        const MinimumFee = Math.ceil(minimumFee * transactionSizeBytes);
        return {
            fatestFee: recommendedFastestFee,
            MediumFee: MediumFee,
            LowFee: MinimumFee,
            economicFee: MinimumFee,
        };
    }
}
exports.getRecommendedBitcoinFee = getRecommendedBitcoinFee;
