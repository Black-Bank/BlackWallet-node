import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { InsertBalance } from "../database/balance/insertBalance";
import { RemoveBalance } from "../database/balance/removeBalance";
import { Balance } from "../entities/balance";

import { FormatedData } from "../database/balance/formatedData";
import { Wallet } from "../entities/Wallet";
import { CoinPrice } from "../Domain/getCoinPrice";

@Resolver()
export class BalanceResolver {
  @Query(() => Balance)
  async getBalance(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string
  ): Promise<Balance> {
    return await FindBalance(HashId, key);
  }

  @Query(() => Number)
  async CoinPrice(@Arg("coin") coin: string): Promise<number> {
    return await CoinPrice(coin);
  }

  @Query(() => [Wallet])
  async getFormatedData(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string,
    @Arg("mainNet") mainNet: string
  ): Promise<Array<Wallet>> {
    return await FormatedData(HashId, key, mainNet);
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
    @Arg("NewBalance") newBalance: number
  ): Promise<boolean | string> {
    let lastBalance = await FindBalance(HashId, key);

    InsertBalance(HashId, key, newBalance, lastBalance);

    return true;
  }
}
