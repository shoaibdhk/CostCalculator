import { ObjectType, ID, Field, Float } from "type-graphql";
import { User } from "User/user.type";
import { CostCalculate } from "./costcalculate.type";

@ObjectType()
export class Post {
  @Field(() => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => [CostCalculate], { nullable: true })
  costs?: CostCalculate[];
}
