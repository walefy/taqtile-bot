import { Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UsersInfoInput {
  @Field(() => Int)
  @Min(1, { message: 'Page limit must be greater than 0' })
  pageLimit: number;

  @Field(() => Int)
  @Min(1, { message: 'Page must be greater than 0' })
  page: number;
}
