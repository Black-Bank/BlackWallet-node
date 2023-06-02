import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Extract {
  @Field()
  hash: string;
  @Field()
  type: string;
  @Field()
  addressFrom: string;
  @Field()
  addressTo: string;
  @Field()
  value: number;
  @Field()
  confirmed: boolean;
  @Field()
  date: Date;
  @Field()
  fee: number;
}
