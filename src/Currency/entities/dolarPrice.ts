import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DolarPrice {
  @Field()
  Price: number;
}
