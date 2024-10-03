import { PrismaClient } from '@prisma/client';
import { UserInput } from '../dtos/inputs/user-input';
import { UserModel } from '../dtos/models/user-model';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists-exception';
import { PasswordService } from './password-service';

export class UserService {
  // TODO: criar minha própria model e inverter a dependência
  private model = new PrismaClient();

  async createUser(data: UserInput): Promise<UserModel> {
    const userExists = await this.model.user.findFirst({ where: { email: data.email } });

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    data.password = PasswordService.hashPassword(data.password);
    const user = await this.model.user.create({ data });

    return user;
  }
}
