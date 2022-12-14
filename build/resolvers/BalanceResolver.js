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
const removeBalance_1 = require("../database/balance/removeBalance");
const balance_1 = require("../entities/balance");
const formatedData_1 = require("../database/balance/formatedData");
const Wallet_1 = require("../entities/Wallet");
let BalanceResolver = class BalanceResolver {
    async getBalance(key, HashId) {
        return await (0, findBalance_1.FindBalance)(HashId, key);
    }
    async getFormatedData(key, HashId, mainNet, API_KEY) {
        return await (0, formatedData_1.FormatedData)(HashId, key, mainNet, API_KEY);
    }
    RemoveBalance(key, HashId, removeOption) {
        (0, removeBalance_1.RemoveBalance)(HashId, key, removeOption);
        return true;
    }
    async InsertBalance(key, HashId, newBalance) {
        let lastBalance = await (0, findBalance_1.FindBalance)(HashId, key);
        (0, insertBalance_1.InsertBalance)(HashId, key, newBalance, lastBalance);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => balance_1.Balance),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("HashId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getBalance", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wallet_1.Wallet]),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("HashId")),
    __param(2, (0, type_graphql_1.Arg)("mainNet")),
    __param(3, (0, type_graphql_1.Arg)("API_KEY")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getFormatedData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("HashId")),
    __param(2, (0, type_graphql_1.Arg)("removeOption")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Boolean)
], BalanceResolver.prototype, "RemoveBalance", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean || String),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("HashId")),
    __param(2, (0, type_graphql_1.Arg)("NewBalance")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "InsertBalance", null);
BalanceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BalanceResolver);
exports.BalanceResolver = BalanceResolver;
