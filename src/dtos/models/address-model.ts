import { Field, Int, ObjectType } from 'type-graphql';
import { UserModel } from './user-model';

@ObjectType()
export class AddressModel {
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

  @Field()
  user: UserModel;
}
