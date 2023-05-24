import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { InsertBalance } from "../database/balance/insertBalance";
import { RemoveBalance } from "../database/balance/removeBalance";
import { Balance } from "../entities/Balance";

import { FormatedData } from "../database/balance/formatedData";
import { Wallet } from "../entities/Wallet";
import { CoinPrice } from "../Domain/getCoinPrice";
import { TransferInfo } from "../entities/InfoTransfer";
import { getRecommendedBitcoinFee } from "../Domain/getTransferFee";
import Crypto from "../services/ComunicationSystemAuth";

@Resolver()
export class BalanceResolver {
  @Query(() => Balance)
  async getBalance(@Arg("Email") Email: string): Promise<Balance> {
    return await FindBalance(Email);
  }

  @Query(() => Number)
  async CoinPrice(@Arg("coin") coin: string): Promise<number> {
    return await CoinPrice(coin);
  }

  @Query(() => TransferInfo)
  async getTransferInfo(@Arg("coin") coin: string): Promise<TransferInfo> {
    return await getRecommendedBitcoinFee(coin);
  }
  @Query(() => [Wallet])
  async getFormatedData(@Arg("Email") Email: string): Promise<Array<Wallet>> {
    const crypto = new Crypto();

    return await FormatedData(Email);
  }

  @Mutation(() => Boolean || String)
  async InsertBalance(
    @Arg("Email") Email: string,
    @Arg("NewBalance") newBalance: number
  ): Promise<boolean | string> {
    let lastBalance = await FindBalance(Email);
    InsertBalance(Email, newBalance, lastBalance);

    return true;
  }
}
