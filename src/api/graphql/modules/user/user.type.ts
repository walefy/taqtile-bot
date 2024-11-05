import { UserModel } from '@domain/model';
import { AddressModelWithoutUser } from 'dtos/models/address-model';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User implements UserModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date;
}

// TODO: transferir AddressModelWithoutUser/AddressModel/etc para uma pasta common
@ObjectType()
export class UserWithAddress extends User {
  @Field(() => [AddressModelWithoutUser])
  address: AddressModelWithoutUser[];
}
