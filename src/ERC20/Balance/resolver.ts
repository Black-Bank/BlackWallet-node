import { Resolver, Query, Arg } from "type-graphql";
import { BalanceLoaderERC20 } from "./loader";
import { ResponseContract } from "./entities";
import { getERC20Wallet } from "./Domain";
import { IDollarWallet } from "./types";

@Resolver()
export class BalanceResolverERC20 {
  @Query(() => ResponseContract)
  async getContractBalance(
    @Arg("name") name: string,
    @Arg("email") email: string
  ): Promise<ResponseContract> {
    const wallet = (await getERC20Wallet({ email, name })) as IDollarWallet;
    const address = wallet.address;
    let contractAddress = "";
    let contractFactor = 1;
    let contractType = "";
    switch (name) {
      case "PRINCIPAL" || "DOLLAR":
        contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
        contractFactor = 1000000;
        contractType = "Dollar";

        break;
    }

    return await BalanceLoaderERC20(
      name,
      address,
      contractAddress,
      contractFactor,
      contractType
    );
  }
}
