import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail(undefined, { message: 'The email field must receive a valid email' })
  email: string;

  @Field()
  @IsString({ message: 'The password field must be a string' })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'The rememberMe field must be a boolean' })
  rememberMe?: boolean;
}
