import { Arg, Mutation, Resolver } from 'type-graphql';
import { UserModel } from '../dtos/models/user-model';
import { UserInput } from '../dtos/inputs/user-input';
import { UserService } from '../services/user-service';
import { Service } from 'typedi';
import { LoginModel } from '../dtos/models/login-model';
import { LoginInput } from '../dtos/inputs/login-input';

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  async createUser(@Arg('data') data: UserInput): Promise<UserModel> {
    return this.userService.createUser(data);
  }

  @Mutation(() => LoginModel)
  login(@Arg('data') data: LoginInput): Promise<LoginModel> {
    return this.userService.login(data);
  }
}
