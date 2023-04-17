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
exports.AuthResolver = void 0;
const type_graphql_1 = require("type-graphql");
const InsertCypher_1 = require("../Domain/InsertCypher");
const InsertUser_1 = require("../Domain/InsertUser");
const AuthUser_1 = require("../Domain/AuthUser");
const hasUser_1 = require("../Domain/hasUser");
const ComunicationSystemAuth_1 = __importDefault(require("../services/ComunicationSystemAuth"));
let AuthResolver = class AuthResolver {
    async VerifyUser(token) {
        const crypto = new ComunicationSystemAuth_1.default();
        const decryptedToken = crypto.decrypt(token);
        const tokenJson = JSON.parse(decryptedToken);
        const Email = tokenJson.email;
        const key = tokenJson.key;
        const passWord = tokenJson.passWord;
        const time = tokenJson.timer;
        const limitedQueryTime = 10000;
        const dbPromise = (0, AuthUser_1.AuthUser)(Email, key, passWord);
        const objToken = {
            timer: time + limitedQueryTime,
            email: Email,
            isAuthenticated: false,
        };
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutInfo = false;
                reject(timeoutInfo);
            }, limitedQueryTime);
        });
        try {
            const result = await Promise.race([dbPromise, timeoutPromise]);
            objToken.isAuthenticated = Boolean(result);
            const objTokenText = JSON.stringify(objToken);
            return crypto.encrypt(objTokenText);
        }
        catch (error) {
            objToken.isAuthenticated = false;
            const objTokenText = JSON.stringify(objToken);
            return crypto.encrypt(objTokenText);
        }
    }
    async CreateUser(key, Email, passWord) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasThisUser = await (0, hasUser_1.hasUser)(Email, key);
        if (regex.test(Email) && !hasThisUser) {
            return await (0, InsertUser_1.InsertUser)(Email, key, passWord);
        }
        else if (hasThisUser) {
            throw new Error(`Invalid user Email`);
        }
        else {
            throw new Error(`Invalid Email`);
        }
    }
    async UpdatePass(key, Email, passWord) {
        return await (0, InsertCypher_1.InsertCypher)(Email, key, passWord);
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "VerifyUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("Email")),
    __param(2, (0, type_graphql_1.Arg)("passWord")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "CreateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("key")),
    __param(1, (0, type_graphql_1.Arg)("Email")),
    __param(2, (0, type_graphql_1.Arg)("passWord")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "UpdatePass", null);
AuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AuthResolver);
exports.AuthResolver = AuthResolver;
