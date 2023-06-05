import { Resolver, Mutation, Arg } from "type-graphql";
import { replaceTransaction } from "./Domain";

@Resolver()
export class TransactionResolver {
  @Mutation(() => String)
  async ReplaceTransaction(
    @Arg("originalTxId") originalTxId: string,
    @Arg("addressFrom") addressFrom: string,
    @Arg("toAddress") toAddress: string,
    @Arg("privateKey") privateKey: string,
    @Arg("newFee") newFee: number
  ) {
    return await replaceTransaction(
      originalTxId,
      addressFrom,
      toAddress,
      privateKey,
      newFee
    );
  }
}
