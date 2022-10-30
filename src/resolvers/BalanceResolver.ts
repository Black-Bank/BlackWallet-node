import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { RemoveBalance } from "../database/balance/removeBalance";
import { Balance } from "../entities/balance";

@Resolver()
export class BalanceResolver {
  @Query(() => Balance)
  async getBalance(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string
  ): Promise<Balance> {
    return await FindBalance(HashId, key);
  }
  @Mutation(() => Boolean)
  RemoveBalance(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string,
    @Arg("removeOption") removeOption: string
  ): boolean {
    RemoveBalance(HashId, key, removeOption);
    return true;
  }
}
