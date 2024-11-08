import { AddressModel, AddressModelWithoutUser } from '@domain/model';
import { User } from '@graphql/modules/user/user.type';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class AddressWithoutUser implements AddressModelWithoutUser {
  @Field(() => Int)
  id: number;

  @Field()
  zipCode: string;

  @Field()
  street: string;

  @Field(() => Int)
  streetNumber: number;

  @Field(() => String, { nullable: true })
  complement: string | null;

  @Field()
  neighborhood: string;

  @Field()
  city: string;

  @Field()
  state: string;
}

@ObjectType()
export class Address extends AddressWithoutUser implements AddressModel {
  @Field(() => User)
  user: User;
}
