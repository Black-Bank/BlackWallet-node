import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Wallet {
  @Field()
  name: string;
  @Field()
  WalletType: string;
  @Field()
  address: string;
  @Field()
  privateKey: string;
}
