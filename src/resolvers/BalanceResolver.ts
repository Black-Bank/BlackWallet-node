import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { FindBalance } from "../database/balance/findBalance";
import { InsertBalance } from "../database/balance/insertBalance";
import { RemoveBalance } from "../database/balance/removeBalance";
import { Balance } from "../entities/balance";
import axios from "axios";
import { Console } from "console";

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
  async getPrice(
    @Arg("coin") coin: string,
    @Arg("apiKey") apiKey: string
  ): Promise<number> {
    let priceInfo = 0;
    if (coin === "BTC") {
      const getPrice_url = `https://chain.so/api/v2/get_price/BTC/USD`;
      const response = await axios.get(getPrice_url);
      let exchangeArray = response?.data.data.prices;
      exchangeArray.map((data) => (priceInfo += Number(data.price)));

      return Number((priceInfo / exchangeArray.length).toFixed(2));
    } else if (coin === "ETH") {
      const getPrice_url =
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
      const response = await axios.get(getPrice_url, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      });
      let coinInfo = response.data.data.filter((data) => data.symbol === coin);
      let coinPrice = Number(coinInfo[0].quote.USD.price.toFixed(2));

      return coinPrice;
    }
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
