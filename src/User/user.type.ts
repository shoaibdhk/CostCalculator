import { ObjectType, Field, ID } from "type-graphql";
import { Post } from "Post/post.type";
@ObjectType()
export class User {
  @Field(() => ID)
  readonly id: string;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;

  @Field(() => [Post])
  posts: Post[];
}
