import { Post } from "./post.type";
import { Resolver, Query } from "type-graphql";

@Resolver()
class PostResolver {
  @Query(() => Post)
  post() {}
}
