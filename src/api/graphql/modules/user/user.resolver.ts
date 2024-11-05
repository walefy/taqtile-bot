import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserWithAddress } from './user.type';
import { AuthGuard } from 'decorators/auth-guard';
import { UserService } from 'services/user-service';
import { UserInfoInput, UserInput, UsersInfoInput } from './user.input';
import { Login } from './login.type';
import { LoginInput } from './login.input';

@Service()
@Resolver()
export class UserResolver {
  // TODO: transformar userService em um use-case
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserWithAddress)
  @AuthGuard()
  createUser(@Arg('data') data: UserInput): Promise<UserWithAddress> {
    return this.userService.createUser(data);
  }

  @Mutation(() => Login)
  login(@Arg('data') data: LoginInput): Promise<Login> {
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
