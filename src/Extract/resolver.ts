import { Resolver, Query, Arg } from "type-graphql";
import { Extract } from "./type";
import { handleWalletsExtract } from "./loader";

@Resolver()
export class ExtractResolver {
  @Query(() => [Extract])
  async getExtract(@Arg("Email") Email: string) {
    return await handleWalletsExtract(Email);
  }
}
