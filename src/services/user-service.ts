import { UserInput } from '../dtos/inputs/user-input';
import { UserModel } from '../dtos/models/user-model';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists-exception';
import { PasswordService } from './password-service';
import { Service } from 'typedi';
import { UserRepository } from '../repositories/user-repository';

@Service()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: UserInput): Promise<UserModel> {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    data.password = PasswordService.hashPassword(data.password);
    const user = await this.userRepository.create(data);

    return user;
  }
}
