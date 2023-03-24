import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Cypher } from "../Domain/cypher";
import { InsertCypher } from "../Domain/InsertCypher";

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async UpdatePass(
    @Arg("key") key: string,

    @Arg("HashId") HashId: string,
    @Arg("passCripto") passCripto: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    const hashedPassword = Cypher(passWord, passCripto);

    return await InsertCypher(HashId, key, hashedPassword);
  }
}
