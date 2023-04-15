import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Cypher } from "../Domain/cypher";
import { InsertCypher } from "../Domain/InsertCypher";
import { InsertUser } from "../Domain/InsertUser";
import { AuthUser } from "../Domain/AuthUser";
import { hasUser } from "../Domain/hasUser";

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async VerifyUser(
    @Arg("key") key: string,
    @Arg("Email") Email: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    return AuthUser(Email, key, passWord);
  }

  @Mutation(() => Boolean)
  async CreateUser(
    @Arg("key") key: string,
    @Arg("Email") Email: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasThisUser = await hasUser(Email, key);

    if (regex.test(Email) && !hasThisUser) {
      return await InsertUser(Email, key, passWord);
    } else if (hasThisUser) {
      throw new Error(`Invalid user Email`);
    } else {
      throw new Error(`Invalid Email`);
    }
  }

  @Mutation(() => Boolean)
  async UpdatePass(
    @Arg("key") key: string,
    @Arg("Email") Email: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    return await InsertCypher(Email, key, passWord);
  }
}
