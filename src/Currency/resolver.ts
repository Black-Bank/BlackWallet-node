import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { Balance } from "../entities/Balance";
import { DolarPrice } from "./entities/dolarPrice";
import { getDollarPriceInReais } from "./Domain";

@Resolver()
export class CurrencyResolver {
  @Query(() => DolarPrice)
  async getDolarPrice(): Promise<DolarPrice> {
    return getDollarPriceInReais();
  }
}
