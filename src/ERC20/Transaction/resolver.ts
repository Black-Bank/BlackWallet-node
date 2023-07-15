import { Resolver, Query, Arg } from "type-graphql";
import { ResponseContractSendToken } from "./entities";
import { SendTokenLoaderERC20 } from "./loader";

@Resolver()
export class SendTokenResolverERC20 {
  @Query(() => ResponseContractSendToken)
  async SendToken(
    @Arg("name") name: string,
    @Arg("addressFrom") addressFrom: string,
    @Arg("addressTo") addressTo: string,
    @Arg("contractAddress") contractAddress: string,
    @Arg("contractFactor") contractFactor: number,
    @Arg("amount") amount: number,
    @Arg("privateKey") privateKey: string
  ): Promise<ResponseContractSendToken> {
    return SendTokenLoaderERC20(
      name,
      addressFrom,
      addressTo,
      contractAddress,
      contractFactor,
      amount,
      privateKey
    );
  }
}
