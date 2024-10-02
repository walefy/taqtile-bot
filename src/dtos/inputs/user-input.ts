import { IsEmail, Matches, MaxDate, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  name: string;

  @Field()
  @IsEmail(undefined, { message: 'The email field must receive a valid email' })
  email: string;

  @Field()
  @MinLength(6, { message: 'The password field must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'The password must have at least one letter and one number.' })
  password: string;

  @Field()
  @MaxDate(() => new Date(), { message: 'the birthDate field must receive a date before the current day' })
  birthDate: Date;
}
