import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail(undefined, { message: 'The email field must receive a valid email' })
  email: string;

  @Field()
  password: string;
}
