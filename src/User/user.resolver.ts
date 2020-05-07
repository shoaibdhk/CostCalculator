import { LoginInput } from "./user.input";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "./user.type";

@Resolver(User)
class UserResolver {
  @Query(() => String)
  me() {
    return "I amm";
  }

  @Mutation(() => User)
  login(@Arg("data") data: LoginInput) {
    console.log(JSON.stringify(data, undefined));
  }
}
