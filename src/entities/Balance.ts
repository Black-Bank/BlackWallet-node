/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Balance {
  @Field((type) => [Number])
  month: number[];
  @Field((type) => [Number])
  week: number[];
  @Field((type) => [Number])
  day: number[];
  @Field()
  updateDate: string;
}
