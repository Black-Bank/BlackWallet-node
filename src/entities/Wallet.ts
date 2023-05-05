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
  @Field()
  balance?: number;
  @Field()
  coinPrice?: number;
  @Field()
  totalBalance?: number;
  @Field()
  unconfirmedBalance: number
}

@ObjectType()
export class ICoinPrice {
  @Field()
  value: number;
}
