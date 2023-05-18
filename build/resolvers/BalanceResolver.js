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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceResolver = void 0;
const type_graphql_1 = require("type-graphql");
const findBalance_1 = require("../database/balance/findBalance");
const insertBalance_1 = require("../database/balance/insertBalance");
const Balance_1 = require("../entities/Balance");
const formatedData_1 = require("../database/balance/formatedData");
const Wallet_1 = require("../entities/Wallet");
const getCoinPrice_1 = require("../Domain/getCoinPrice");
const InfoTransfer_1 = require("../entities/InfoTransfer");
const getTransferFee_1 = require("../Domain/getTransferFee");
let BalanceResolver = class BalanceResolver {
    async getBalance(Email) {
        return await (0, findBalance_1.FindBalance)(Email);
    }
    async CoinPrice(coin) {
        return await (0, getCoinPrice_1.CoinPrice)(coin);
    }
    async getTransferInfo(coin) {
        return await (0, getTransferFee_1.getRecommendedBitcoinFee)(coin);
    }
    async getFormatedData(Email) {
        return await (0, formatedData_1.FormatedData)(Email);
    }
    async InsertBalance(Email, newBalance) {
        let lastBalance = await (0, findBalance_1.FindBalance)(Email);
        (0, insertBalance_1.InsertBalance)(Email, newBalance, lastBalance);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Balance_1.Balance),
    __param(0, (0, type_graphql_1.Arg)("Email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getBalance", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)("coin")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "CoinPrice", null);
__decorate([
    (0, type_graphql_1.Query)(() => InfoTransfer_1.TransferInfo),
    __param(0, (0, type_graphql_1.Arg)("coin")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getTransferInfo", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wallet_1.Wallet]),
    __param(0, (0, type_graphql_1.Arg)("Email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getFormatedData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean || String),
    __param(0, (0, type_graphql_1.Arg)("Email")),
    __param(1, (0, type_graphql_1.Arg)("NewBalance")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "InsertBalance", null);
BalanceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BalanceResolver);
exports.BalanceResolver = BalanceResolver;
