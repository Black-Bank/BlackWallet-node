import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Send {
  @Field()
  code: string;
  @Field()
  isSend: boolean;
}
