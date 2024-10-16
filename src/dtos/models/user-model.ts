import { Field, ObjectType } from 'type-graphql';
import { AddressModelWithoutUser } from './address-model';

@ObjectType()
export class UserModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date;
}

@ObjectType()
export class UserWithAddress extends UserModel {
  @Field(() => [AddressModelWithoutUser])
  address: AddressModelWithoutUser[];
}
