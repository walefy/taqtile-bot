import { Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AddressInput {
  @Field()
  street: string;

  @Field()
  zipCode: string;

  @Field(() => Int)
  streetNumber: number;

  @Field({ nullable: true })
  complement?: string;

  @Field()
  neighborhood: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  @Min(1, { message: 'The id field must be greater than 0' })
  userId: number;
}
