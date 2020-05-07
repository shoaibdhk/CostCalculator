import { User } from "User/user.type";
import { InputType, Field } from "type-graphql";
import { isEmail, MinLength, isNotEmpty } from "class-validator";

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @isEmail()
  @isNotEmpty()
  email: string;

  @Field()
  @MinLength(5, { message: "Password is too short" })
  password: string;
}
