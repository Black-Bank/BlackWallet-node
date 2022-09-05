"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
require("reflect-metadata");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const RecipeResolver_1 = require("./resolvers/RecipeResolver");
async function bootstrap() {
    const server = new apollo_server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [RecipeResolver_1.RecipeResolver],
        }),
    });
    server.listen(4000);
}
exports.bootstrap = bootstrap;
bootstrap();
