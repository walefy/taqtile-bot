import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserWithAddress } from './user.type';
import { AuthGuard } from '@graphql/decorators/auth-guard';
import { UserInfoInput, UserInput, UsersInfoInput } from './user.input';
import { Login } from './login.type';
import { LoginInput } from './login.input';
import { CreateUserUseCase, GetAllUsersUseCase, GetUserUseCase, LoginUseCase } from '@domain/user';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @Mutation(() => UserWithAddress)
  @AuthGuard()
  createUser(@Arg('data') data: UserInput): Promise<UserWithAddress> {
    return this.createUserUseCase.execute(data);
  }

  @Mutation(() => Login)
  login(@Arg('data') data: LoginInput): Promise<Login> {
    return this.loginUseCase.execute(data);
  }

  @Query(() => UserWithAddress)
  @AuthGuard()
  user(@Arg('data') data: UserInfoInput): Promise<UserWithAddress> {
    return this.getUserUseCase.execute(data.id);
  }

  @Query(() => [UserWithAddress])
  @AuthGuard()
  users(@Arg('data', { nullable: true }) data?: UsersInfoInput): Promise<UserWithAddress[]> {
    return this.getAllUsersUseCase.execute({ page: data?.page, pageLimit: data?.pageLimit });
  }
}
