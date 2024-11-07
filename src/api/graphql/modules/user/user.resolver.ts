import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserWithAddress } from './user.type';
import { AuthGuard } from '@graphql/decorators/auth-guard';
import { UserInfoInput, UserInput, UsersInfoInput } from './user.input';
import { Login } from './login.type';
import { LoginInput } from './login.input';
import { CreateUserUseCase, GetAllUsersUseCase, GetUserUseCase, LoginUseCase } from '@domain/user';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CreateUsersWithCsvUseCase } from '@domain/user/create-users-with-csv.use-case';
import { UserCsvInput } from './user-csv.input';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly createUsersWithCsvUseCase: CreateUsersWithCsvUseCase,
  ) {}

  @Mutation(() => UserWithAddress)
  @AuthGuard()
  createUser(@Arg('data') data: UserInput): Promise<UserWithAddress> {
    return this.createUserUseCase.execute(data);
  }

  @Mutation(() => String)
  @AuthGuard()
  async createUsersWithCsv(@Arg('file', () => GraphQLUpload) file: FileUpload): Promise<string> {
    const fileModel = {
      filename: file.filename,
      mimetype: file.mimetype,
      encoding: file.encoding,
      readStream: file.createReadStream(),
    };

    await this.createUsersWithCsvUseCase.execute({
      fileModel,
      validatorClass: UserCsvInput,
    });

    return 'Users created';
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
