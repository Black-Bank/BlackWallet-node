import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Cypher } from "../Domain/cypher";
import { InsertCypher } from "../Domain/InsertCypher";
import { InsertUser } from "../Domain/InsertUser";

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async CreateUser(
    @Arg("key") key: string,
    @Arg("Email") Email: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hashedPassword = Cypher(passWord);
    if (regex.test(Email)) {
      return await InsertUser(Email, key, hashedPassword);
    } else {
      throw new Error(`Invalid email`);
    }
  }
  @Mutation(() => Boolean)
  async UpdatePass(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    const hashedPassword = Cypher(passWord);

    return await InsertCypher(HashId, key, hashedPassword);
  }
}
