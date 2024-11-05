import { IsEmail, Matches, MaxDate, Min, MinLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { UserInfoInputModel, UserInputModel, UsersInfoInputModel } from '@domain/model';

@InputType()
export class UserInput implements UserInputModel {
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

@InputType()
export class UserInfoInput implements UserInfoInputModel {
  @Field()
  @Min(1, { message: 'The id field must be greater than 0' })
  id: number;
}

@InputType()
export class UsersInfoInput implements UsersInfoInputModel {
  @Field(() => Int)
  @Min(1, { message: 'Page limit must be greater than 0' })
  pageLimit: number;

  @Field(() => Int)
  @Min(1, { message: 'Page must be greater than 0' })
  page: number;
}
