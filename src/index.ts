import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./resolvers/RecipeResolver";

export async function bootstrap() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RecipeResolver],
    }),
  });
  server.listen(4000);
}

bootstrap();
