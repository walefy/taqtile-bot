import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { UserWithAddress } from '../dtos/models/user-model';
import { UserInput } from '../dtos/inputs/user-input';
import { UserService } from '../services/user-service';
import { Service } from 'typedi';
import { LoginModel } from '../dtos/models/login-model';
import { LoginInput } from '../dtos/inputs/login-input';
import { AuthGuard } from '../decorators/auth-guard';
import { UserInfoInput } from '../dtos/inputs/user-info-input';
import { UsersInfoInput } from '../dtos/inputs/users-info-input';

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserWithAddress)
  @AuthGuard()
  createUser(@Arg('data') data: UserInput): Promise<UserWithAddress> {
    return this.userService.createUser(data);
  }

  @Mutation(() => LoginModel)
  login(@Arg('data') data: LoginInput): Promise<LoginModel> {
    return this.userService.login(data);
  }

  @Query(() => UserWithAddress)
  @AuthGuard()
  user(@Arg('data') data: UserInfoInput): Promise<UserWithAddress> {
    return this.userService.getUser(data.id);
  }

  @Query(() => [UserWithAddress])
  @AuthGuard()
  users(@Arg('data', { nullable: true }) data?: UsersInfoInput): Promise<UserWithAddress[]> {
    return this.userService.getAllUsers({ page: data?.page, pageLimit: data?.pageLimit });
  }
}
