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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletResolver = void 0;
const type_graphql_1 = require("type-graphql");
const web3_1 = __importDefault(require("web3"));
const insert_1 = require("../database/insert");
const findWallets_1 = require("../database/findWallets");
const bitcore_lib_1 = require("bitcore-lib");
const DeleteWallet_1 = require("../Domain/DeleteWallet");
const axios_1 = __importDefault(require("axios"));
const bitcore = __importStar(require("bitcore-lib"));
const ComunicationSystemAuth_1 = __importDefault(require("../services/ComunicationSystemAuth"));
const web3 = new web3_1.default("https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a");
const crypto = new ComunicationSystemAuth_1.default();
let WalletResolver = class WalletResolver {
    async createEthWallet(name, Email) {
        const wallet = web3.eth.accounts.wallet.create(0);
        const account = web3.eth.accounts.create();
        wallet.add(account.privateKey);
        const newWallet = {
            name: name,
            WalletType: "ETH",
            address: wallet[wallet.length - 1].address,
            privateKey: crypto.encrypt(wallet[wallet.length - 1].privateKey),
        };
        const lastWallet = await (0, findWallets_1.FindWallets)(Email);
        return await (0, insert_1.InsertWallet)(newWallet, Email, lastWallet);
    }
    async createBTCWallet(name, Email) {
        const privateKey = new bitcore_lib_1.PrivateKey();
        const address = privateKey.toAddress();
        const newWallet = {
            name: name,
            WalletType: "BTC",
            address: address.toString(),
            privateKey: crypto.encrypt(privateKey.toString()),
        };
        const lastWallet = await (0, findWallets_1.FindWallets)(Email);
        return await (0, insert_1.InsertWallet)(newWallet, Email, lastWallet);
    }
    async createTransaction(coin, addressFrom, privateKey, addressTo, fee, value) {
        if (coin === "ETH") {
            const balance = Number(await web3.eth.getBalance(addressFrom));
            const gasPrice = Number(await web3.eth.getGasPrice());
            const valueWei = web3.utils.toWei(String(value), "ether");
            const gasEstimate = gasPrice * fee;
            if (balance < Number(valueWei) + gasEstimate) {
                throw new Error("Insufficient funds to cover transaction.");
            }
            const tx = await web3.eth.accounts.signTransaction({
                from: addressFrom,
                to: addressTo,
                value: valueWei,
                chain: "mainnet",
                hardfork: "London",
                gas: fee,
                gasPrice: gasPrice,
            }, crypto.decrypt(privateKey));
            const createReceipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
            return createReceipt.transactionHash;
        }
        if (coin === "BTC") {
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
            txb.to(addressTo, outputAmount).fee(fee);
            // Calculate change amount and add change output
            const changeAmount = inputAmount - outputAmount - fee;
            if (changeAmount < 0) {
                throw new Error("Insufficient funds to cover transaction.");
            }
            if (changeAmount > 0) {
                txb.change(addressFrom);
            }
            // Sign inputs with sender private key
            bitcoreUtxos.forEach(() => {
                const PrivateKey = new bitcore.PrivateKey(crypto.decrypt(privateKey));
                txb.sign(PrivateKey);
            });
            const txHex = txb.serialize();
            const broadcastResponse = await axios_1.default.post(`https://api.bitcore.io/api/BTC/mainnet/tx/send`, { rawTx: txHex });
            const broadcastResult = broadcastResponse.data;
            if (!broadcastResult || !broadcastResult.txid) {
                throw new Error("Transaction broadcast failed.");
            }
            return broadcastResult.txid;
        }
    }
    async deleteWallet(Email, address) {
        return await (0, DeleteWallet_1.DeleteWallets)(Email, address);
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("Email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createEthWallet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("Email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createBTCWallet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("coin")),
    __param(1, (0, type_graphql_1.Arg)("addressFrom")),
    __param(2, (0, type_graphql_1.Arg)("privateKey")),
    __param(3, (0, type_graphql_1.Arg)("addressTo")),
    __param(4, (0, type_graphql_1.Arg)("fee")),
    __param(5, (0, type_graphql_1.Arg)("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createTransaction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("Email")),
    __param(1, (0, type_graphql_1.Arg)("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "deleteWallet", null);
WalletResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WalletResolver);
exports.WalletResolver = WalletResolver;
