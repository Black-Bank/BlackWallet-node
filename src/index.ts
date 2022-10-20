import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { WalletResolver } from "./resolvers/WalletResolver";

export async function bootstrap() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [WalletResolver],
    }),
  });
  server.listen(Number.parseInt(process.env.PORT) || 4000);
}

bootstrap();
