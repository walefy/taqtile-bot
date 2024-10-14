import { Arg, Mutation, Query, Resolver, Int } from 'type-graphql';
import { UserModel } from '../dtos/models/user-model';
import { UserInput } from '../dtos/inputs/user-input';
import { UserService } from '../services/user-service';
import { Service } from 'typedi';
import { LoginModel } from '../dtos/models/login-model';
import { LoginInput } from '../dtos/inputs/login-input';
import { AuthGuard } from '../decorators/auth-guard';
import { UserInfoInput } from '../dtos/inputs/user-info-input';

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  @AuthGuard()
  createUser(@Arg('data') data: UserInput): Promise<UserModel> {
    return this.userService.createUser(data);
  }

  @Mutation(() => LoginModel)
  login(@Arg('data') data: LoginInput): Promise<LoginModel> {
    return this.userService.login(data);
  }

  @Query(() => UserModel)
  @AuthGuard()
  user(@Arg('data') data: UserInfoInput): Promise<UserModel> {
    return this.userService.getUser(data.id);
  }

  @Query(() => [UserModel])
  @AuthGuard()
  users(@Arg('limit', () => Int, { nullable: true }) limit?: number): Promise<UserModel[]> {
    return this.userService.getAllUsers(limit);
  }
}
