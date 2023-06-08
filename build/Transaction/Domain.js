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
exports.replaceTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const bitcore = __importStar(require("bitcore-lib"));
const ComunicationSystemAuth_1 = __importDefault(require("../services/ComunicationSystemAuth"));
const cripto = new ComunicationSystemAuth_1.default();
async function replaceTransaction(originalTxId, addressFrom, toAddress, privateKey, newFee) {
    // Get transaction details
    const transactionDetails = await axios_1.default.get(`https://mempool.space/api/tx/${originalTxId}`);
    const transactionDetailsData = transactionDetails.data;
    // Get UTXOs of the sender address
    const utxosResponse = await axios_1.default.get(`https://blockchain.info/unspent?active=${addressFrom}`);
    const utxos = utxosResponse.data.unspent_outputs;
    // Convert UTXOs to bitcore format
    const bitcoreUtxos = utxos.map((utxo) => new bitcore.Transaction.UnspentOutput({
        txid: utxo.tx_hash_big_endian,
        vout: utxo.tx_output_n,
        scriptPubKey: new bitcore.Script(utxo.script),
        satoshis: utxo.value,
    }));
    // Create a transaction builder
    const txb = new bitcore.Transaction();
    bitcoreUtxos.forEach((utxo) => {
        txb.from(utxo);
    });
    // Calculate output amount and add recipient output
    const outputAmount = Math.floor(transactionDetailsData.vout.find((data) => data.scriptpubkey_address === toAddress).value);
    txb.to(toAddress, outputAmount).fee(newFee);
    // Calculate change amount and add change output if necessary
    const inputAmount = bitcoreUtxos.reduce((total, utxo) => total + utxo.satoshis, 0);
    const changeAmount = inputAmount - outputAmount - newFee;
    if (changeAmount > 0) {
        txb.change(addressFrom);
    }
    // Sign inputs with sender private key
    bitcoreUtxos.forEach(() => {
        const privateKeyInstance = new bitcore.PrivateKey(cripto.decrypt(privateKey));
        txb.sign(privateKeyInstance);
    });
    const txHex = txb.serialize();
    const broadcastResponse = await axios_1.default.post(`https://api.bitcore.io/api/BTC/mainnet/tx/send`, { rawTx: txHex });
    const broadcastResult = broadcastResponse.data;
    if (!broadcastResult || !broadcastResult.txid) {
        throw new Error("Transaction broadcast failed.");
    }
    return broadcastResult.txid;
}
exports.replaceTransaction = replaceTransaction;
