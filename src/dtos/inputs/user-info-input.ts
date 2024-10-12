import { Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInfoInput {
  @Field()
  @Min(1, { message: 'The id field must be greater than 0' })
  id: number;
}
