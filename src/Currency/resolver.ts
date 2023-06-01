import { Resolver, Query } from "type-graphql";
import { DolarPrice } from "./entities/dolarPrice";
import { getDollarPriceInReais } from "./Domain";

@Resolver()
export class CurrencyResolver {
  @Query(() => DolarPrice)
  async getDolarPrice(): Promise<DolarPrice> {
    return getDollarPriceInReais();
  }
}
