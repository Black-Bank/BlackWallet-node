import { Resolver, Query, Arg } from "type-graphql";
import { BalanceLoaderERC20 } from "./loader";
import { ResponseContract } from "./entities";

@Resolver()
export class BalanceResolverERC20 {
  @Query(() => ResponseContract)
  async getContractBalance(
    @Arg("name") name: string,
    @Arg("address") address: string,
    @Arg("contractAddress") contractAddress: string,
    @Arg("contractFactor") contractFactor: number,
    @Arg("contractType") contractType: string
  ): Promise<ResponseContract> {
    return await BalanceLoaderERC20(
      name,
      address,
      contractAddress,
      contractFactor,
      contractType
    );
  }
}
