import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseContract {
  @Field()
  contractType: string;
  @Field()
  value: number;
}
