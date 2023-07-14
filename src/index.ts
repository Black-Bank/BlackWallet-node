import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { WalletResolver } from "./resolvers/WalletResolver";
import { BalanceResolver } from "./resolvers/BalanceResolver";
import { AuthResolver } from "./resolvers/LoginResolver";
import { CurrencyResolver } from "./Currency/resolver";
import { ExtractResolver } from "./Extract/resolver";
import { TransactionResolver } from "./Transaction/TransactionResolver";
import { BalanceResolverERC20 } from "./ERC20/Balance/resolver";

export async function bootstrap() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        WalletResolver,
        BalanceResolver,
        AuthResolver,
        CurrencyResolver,
        ExtractResolver,
        TransactionResolver,
        BalanceResolverERC20,
      ],
    }),
    introspection: true,
  });
  server.listen(Number.parseInt(process.env.PORT) || 4000);
}

bootstrap();
