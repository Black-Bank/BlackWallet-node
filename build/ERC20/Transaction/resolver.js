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
exports.SendTokenResolverERC20 = void 0;
const type_graphql_1 = require("type-graphql");
const entities_1 = require("./entities");
const loader_1 = require("./loader");
let SendTokenResolverERC20 = class SendTokenResolverERC20 {
    async SendToken(name, addressFrom, addressTo, contractAddress, contractFactor, amount, privateKey) {
        return (0, loader_1.SendTokenLoaderERC20)(name, addressFrom, addressTo, contractAddress, contractFactor, amount, privateKey);
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => entities_1.ResponseContractSendToken),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("addressFrom")),
    __param(2, (0, type_graphql_1.Arg)("addressTo")),
    __param(3, (0, type_graphql_1.Arg)("contractAddress")),
    __param(4, (0, type_graphql_1.Arg)("contractFactor")),
    __param(5, (0, type_graphql_1.Arg)("amount")),
    __param(6, (0, type_graphql_1.Arg)("privateKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], SendTokenResolverERC20.prototype, "SendToken", null);
SendTokenResolverERC20 = __decorate([
    (0, type_graphql_1.Resolver)()
], SendTokenResolverERC20);
exports.SendTokenResolverERC20 = SendTokenResolverERC20;
