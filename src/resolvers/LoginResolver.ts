import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { InsertCypher } from "../Domain/InsertCypher";
import { InsertUser } from "../Domain/InsertUser";
import { AuthUser } from "../Domain/AuthUser";
import { hasUser } from "../Domain/hasUser";
import Crypto from "../services/ComunicationSystemAuth";
import { SendEmail } from "../Domain/SendEmail";
import { Send } from "../entities/Send";

const crypto = new Crypto();
@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  async VerifyUser(@Arg("token") token: string): Promise<string> {
    const decryptedToken = crypto.decrypt(token);
    const tokenJson = JSON.parse(decryptedToken);
    const Email = tokenJson.email;
    const passWord = tokenJson.passWord;
    const time = tokenJson.timer;
    const limitedQueryTime = 20000;
    const dbPromise = AuthUser(Email, passWord);
    const objToken = {
      timer: time + limitedQueryTime,
      email: Email,
      isAuthenticated: false,
    };
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const timeoutInfo: boolean = false;
        reject(timeoutInfo);
      }, limitedQueryTime);
    });

    try {
      const result = await Promise.race([dbPromise, timeoutPromise]);
      objToken.isAuthenticated = Boolean(result);
      const objTokenText = JSON.stringify(objToken);

      return crypto.encrypt(objTokenText);
    } catch (error) {
      objToken.isAuthenticated = false;
      const objTokenText = JSON.stringify(objToken);
      return crypto.encrypt(objTokenText);
    }
  }

  @Mutation(() => Boolean)
  async CreateUser(@Arg("token") token: string): Promise<boolean> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const decryptedToken = crypto.decrypt(token);
    const tokenJson = JSON.parse(decryptedToken);
    const Email = tokenJson.email;
    const passWord = tokenJson.passWord;

    const hasThisUser = await hasUser(Email, passWord);

    if (regex.test(Email) && !hasThisUser) {
      return await InsertUser(Email, passWord);
    } else if (hasThisUser) {
      throw new Error(`Invalid user Email`);
    } else {
      throw new Error(`Invalid Email`);
    }
  }

  @Mutation(() => Boolean)
  async UpdatePass(
    @Arg("Email") Email: string,
    @Arg("passWord") passWord: string
  ): Promise<boolean> {
    return await InsertCypher(Email, passWord);
  }
  @Mutation(() => Send)
  async SendCodePassEmail(@Arg("Email") Email: string): Promise<Send> {
    return await SendEmail(Email);
  }
}
