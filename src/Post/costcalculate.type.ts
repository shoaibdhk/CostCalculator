import { Post } from "Post/post.type";
import { ObjectType, ID, Field, Float } from "type-graphql";

@ObjectType()
export class CostCalculate {
  @Field(() => ID)
  readonly id: string;

  @Field()
  title: string;
  @Field(() => Float)
  price: number;

  @Field(() => Post)
  post: Post;
}
