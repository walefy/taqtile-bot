import { LoginModel } from '@domain/model';
import { Field, ObjectType } from 'type-graphql';
import { User } from './user.type';

@ObjectType()
export class Login implements LoginModel {
  @Field()
  user: User;

  @Field()
  token: string;
}
