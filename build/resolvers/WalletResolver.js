"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const Wallet_1 = require("../entities/Wallet");
const web3_1 = __importDefault(require("web3"));
const insert_1 = require("../database/insert");
const findWallets_1 = require("../database/findWallets");
const bitcore_lib_1 = require("bitcore-lib");
const DeleteWallet_1 = require("../Domain/DeleteWallet");
const web3 = new web3_1.default("https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a");
let WalletResolver = class WalletResolver {
    async getWallets(key, HashId) {
        return await (0, findWallets_1.FindWallets)(HashId, key);
    }
    async createEthWallet(key, name, HashId) {
        const wallet = web3.eth.accounts.wallet.create(0);
        const account = web3.eth.accounts.create();
        wallet.add(account.privateKey);
        let newWallet = {
            name: name,
            WalletType: "ETH",
            address: wallet[wallet.length - 1].address,
            privateKey: wallet[wallet.length - 1].privateKey,
        };
        let lastWallet = await (0, findWallets_1.FindWallets)(HashId, key);
        return await (0, insert_1.InsertWallet)(newWallet, HashId, key, lastWallet);
    }
    async createBTCWallet(key, name, HashId) {
        const privateKey = new bitcore_lib_1.PrivateKey();
        const address = privateKey.toAddress();
        let newWallet = {
            name: name,
            WalletType: "BTC",
            address: address.toString(),
            privateKey: privateKey.toString(),
        };
        let lastWallet = await (0, findWallets_1.FindWallets)(HashId, key);
        return await (0, insert_1.InsertWallet)(newWallet, HashId, key, lastWallet);
    }
    async createTransaction(addressFrom, privateKey, addressTo, value) {
        const tx = await web3.eth.accounts.signTransaction({
            from: addressFrom,
            to: addressTo,
            value: web3.utils.toWei(String(value), "ether"),
            chain: "mainnet",
            hardfork: "London",
            gas: "22000",
        }, privateKey);
        const createReceipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
        return createReceipt.transactionHash;
    }
    async deleteWallet(HashId, key, address) {
        return await (0, DeleteWallet_1.DeleteWallets)(HashId, key, address);
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Wallet_1.Wallet]),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("HashId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "getWallets", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("name")),
    __param(2, (0, type_graphql_1.Arg)("HashId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createEthWallet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("name")),
    __param(2, (0, type_graphql_1.Arg)("HashId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createBTCWallet", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("addressFrom")),
    __param(1, (0, type_graphql_1.Arg)("privateKey")),
    __param(2, (0, type_graphql_1.Arg)("addressTo")),
    __param(3, (0, type_graphql_1.Arg)("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "createTransaction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("HashId")),
    __param(1, (0, type_graphql_1.Arg)("key")),
    __param(2, (0, type_graphql_1.Arg)("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WalletResolver.prototype, "deleteWallet", null);
WalletResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WalletResolver);
exports.WalletResolver = WalletResolver;
