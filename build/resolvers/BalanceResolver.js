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
exports.BalanceResolver = void 0;
const type_graphql_1 = require("type-graphql");
const findBalance_1 = require("../database/balance/findBalance");
const insertBalance_1 = require("../database/balance/insertBalance");
const removeBalance_1 = require("../database/balance/removeBalance");
const balance_1 = require("../entities/balance");
const axios_1 = __importDefault(require("axios"));
let BalanceResolver = class BalanceResolver {
    async getBalance(key, HashId) {
        return await (0, findBalance_1.FindBalance)(HashId, key);
    }
    async getPrice(coin, apiKey) {
        let priceInfo = 0;
        if (coin === "BTC") {
            const getPrice_url = `https://chain.so/api/v2/get_price/BTC/USD`;
            const response = await axios_1.default.get(getPrice_url);
            let exchangeArray = response === null || response === void 0 ? void 0 : response.data.data.prices;
            exchangeArray.map((data) => (priceInfo += Number(data.price)));
            return Number((priceInfo / exchangeArray.length).toFixed(2));
        }
        else if (coin === "ETH") {
            const getPrice_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
            const response = await axios_1.default.get(getPrice_url, {
                headers: {
                    "X-CMC_PRO_API_KEY": apiKey,
                },
            });
            let coinInfo = response.data.data.filter((data) => data.symbol === coin);
            let coinPrice = Number(coinInfo[0].quote.USD.price.toFixed(2));
            return coinPrice;
        }
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
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)("coin")),
    __param(1, (0, type_graphql_1.Arg)("apiKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BalanceResolver.prototype, "getPrice", null);
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
