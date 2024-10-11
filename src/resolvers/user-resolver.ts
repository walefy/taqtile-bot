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
  async createUser(@Arg('data') data: UserInput) {
    const user = await this.userService.createUser(data);
    return user;
  }

  @Mutation(() => LoginModel)
  async login(@Arg('data') data: LoginInput) {
    const login = await this.userService.login(data);
    return login;
  }
}
