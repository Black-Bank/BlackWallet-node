import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseContractSendToken {
  @Field()
  name: string;
  @Field()
  value: number;
  @Field()
  addressFrom: string;
  @Field()
  addressTo: string;
  @Field()
  txHash: string;
}
