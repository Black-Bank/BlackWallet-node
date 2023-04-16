import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { InsertCypher } from "../Domain/InsertCypher";
import { InsertUser } from "../Domain/InsertUser";
import { AuthUser } from "../Domain/AuthUser";
import { hasUser } from "../Domain/hasUser";
import Crypto from "../services/ComunicationSystemAuth";
import { TimeoutError, TimeoutInfo } from "rxjs";

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async VerifyUser(@Arg("token") token: string): Promise<boolean> {
    const crypto = new Crypto();
    const decryptedToken = crypto.decrypt(token);
    const tokenJson = JSON.parse(decryptedToken);
    const Email = tokenJson.email;
    const key = tokenJson.key;
    const passWord = tokenJson.passWord;
    const limitedQueryTime = 10000;

    const dbPromise = AuthUser(Email, key, passWord);

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const timeoutInfo: boolean = false;
        reject(timeoutInfo);
      }, limitedQueryTime);
    });

    try {
      const result = await Promise.race([dbPromise, timeoutPromise]);

      return Boolean(result);
    } catch (error) {
      return false;
    }
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
