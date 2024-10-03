import { Arg, Mutation, Resolver } from 'type-graphql';
import { UserModel } from '../dtos/models/user-model';
import { UserInput } from '../dtos/inputs/user-input';
import { UserService } from '../services/user-service';

@Resolver()
export class UserResolver {
  // TODO: inverter a dependência
  constructor(private readonly userService: UserService = new UserService()) {}

  @Mutation(() => UserModel)
  async createUser(@Arg('data') data: UserInput) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
