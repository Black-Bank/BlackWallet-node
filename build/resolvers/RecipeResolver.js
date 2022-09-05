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
exports.RecipeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const recipedata_1 = require("../database/recipedata");
const Recipe_1 = require("../entities/Recipe");
const RecipeDataType_1 = require("../types/RecipeDataType");
const uuid_1 = require("uuid");
let RecipeResolver = class RecipeResolver {
    getRecipes() {
        return recipedata_1.recipeData;
    }
    createRecipe(data) {
        let newRecipe = { ...data, id: (0, uuid_1.v4)() };
        recipedata_1.recipeData.push(newRecipe);
        return newRecipe;
    }
    deleteRecipe(id) {
        let recipeIndex = recipedata_1.recipeData.findIndex((recipe) => recipe.id === id);
        if (recipeIndex > -1) {
            recipedata_1.recipeData.splice(recipeIndex, 1);
            return true;
        }
        return false;
    }
    updateRecipe(id, data) {
        let recipeIndex = recipedata_1.recipeData.findIndex((recipe) => recipe.id === id);
        if (recipeIndex > -1) {
            recipedata_1.recipeData[recipeIndex] = { ...data, id };
            return recipedata_1.recipeData[recipeIndex];
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Recipe_1.Recipe]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], RecipeResolver.prototype, "getRecipes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Recipe_1.Recipe),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeDataType_1.RecipeDataType]),
    __metadata("design:returntype", Recipe_1.Recipe)
], RecipeResolver.prototype, "createRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Boolean)
], RecipeResolver.prototype, "deleteRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Recipe_1.Recipe),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RecipeDataType_1.RecipeDataType]),
    __metadata("design:returntype", Recipe_1.Recipe)
], RecipeResolver.prototype, "updateRecipe", null);
RecipeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeResolver);
exports.RecipeResolver = RecipeResolver;
