import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Cypher } from "../Domain/cypher";
import { InsertCypher } from "../Domain/InsertCypher";
import { InsertUser } from "../Domain/InsertUser";
import { AuthUser } from "../Domain/AuthUser";
import { hasUser } from "../Domain/hasUser";
import Crypto from "../services/ComunicationSystemAuth";
@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async VerifyUser(@Arg("token") token: string): Promise<boolean> {
    const encryptionKey = "3c29228b1692a2ae8f0$1b747c3dbf3f";
    const iv = "9c9b7638e492ba2b5f8c8825f5b97100";
    const crypto = new Crypto(encryptionKey, encryptionKey, iv);
    const decryptedToken = crypto.decrypt(token);
    const tokenJson = JSON.parse(decryptedToken);
    const Email = tokenJson.email;
    const key = tokenJson.key;
    const passWord = tokenJson.passWord;

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
