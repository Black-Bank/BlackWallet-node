import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { InsertBalance } from "../database/balance/insertBalance";
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

  @Mutation(() => Boolean || String)
  async InsertBalance(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string,
    @Arg("InsertOption") insertOption: string,
    @Arg("NewBalance") newBalance: number
  ): Promise<boolean | string> {
    const options = ["month", "week", "day"];
    let lastBalance = await FindBalance(HashId, key);
    if (options.includes(insertOption)) {
      InsertBalance(HashId, key, newBalance, lastBalance);

      return true;
    } else {
      return `options error, the insert options ${insertOption} is missing on type month, week or day.`;
    }
  }
}
