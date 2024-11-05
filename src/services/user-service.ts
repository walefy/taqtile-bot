import { LoginUnauthorizedError, UserAlreadyExistsError, UserNotFoundError } from '@core/error';
import { PasswordService } from './password-service';
import { Service } from 'typedi';
import { UserRepository } from '../repositories/user-repository';
import { TokenService } from './token-service';
import { findAllArgs } from '../types/iuser-repository';
import { LoginInputModel, LoginModel, UserInputModel, UserWithAddressModel } from '@domain/model';

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(data: UserInputModel): Promise<UserWithAddressModel> {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    data.password = PasswordService.hashPassword(data.password);
    const user = await this.userRepository.create(data);

    return user;
  }

  async login(data: LoginInputModel): Promise<LoginModel> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new LoginUnauthorizedError();
    }

    const passwordMatch = PasswordService.verifyPassword(data.password, user.password);

    if (!passwordMatch) {
      throw new LoginUnauthorizedError();
    }

    const token = this.tokenService.generateToken(user.email, { id: user.id }, data.rememberMe);

    return { user, token };
  }

  async getUser(id: number): Promise<UserWithAddressModel> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  getAllUsers(config: findAllArgs): Promise<UserWithAddressModel[]> {
    return this.userRepository.findAll(config);
  }
}
