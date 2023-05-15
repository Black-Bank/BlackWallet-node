import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TransferInfo {
  @Field()
  fatestFee: number;
  @Field()
  MediumFee: number;
  @Field()
  LowFee: number;
  @Field()
  economicFee: number;
}
