import { UserAlreadyExistsException } from '../exceptions/user-already-exists-exception';
import { PasswordService } from './password-service';
import { Service } from 'typedi';
import { UserRepository } from '../repositories/user-repository';
import { LoginUnauthorizedException } from '../exceptions/login-unauthorized';
import { TokenService } from './token-service';
import { UserWithAddress } from '../types/user';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';
import { findAllArgs } from '../types/iuser-repository';
import { LoginInputModel, LoginModel, UserInputModel } from '@domain/model';

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(data: UserInputModel): Promise<UserWithAddress> {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    data.password = PasswordService.hashPassword(data.password);
    const user = await this.userRepository.create(data);

    return user;
  }

  async login(data: LoginInputModel): Promise<LoginModel> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new LoginUnauthorizedException();
    }

    const passwordMatch = PasswordService.verifyPassword(data.password, user.password);

    if (!passwordMatch) {
      throw new LoginUnauthorizedException();
    }

    const token = this.tokenService.generateToken(user.email, { id: user.id }, data.rememberMe);

    return { user, token };
  }

  async getUser(id: number): Promise<UserWithAddress> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  getAllUsers(config: findAllArgs): Promise<UserWithAddress[]> {
    return this.userRepository.findAll(config);
  }
}
