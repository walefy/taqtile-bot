import { PrismaClient } from '@prisma/client';
import { UserInput } from '../dtos/inputs/user-input';
import { UserModel } from '../dtos/models/user-model';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists-exception';

export class UserService {
  // TODO: criar minha própria model e inverter a dependência
  private model = new PrismaClient();

  async createUser(data: UserInput): Promise<UserModel> {
    // TODO: fazer hash da senha antes de salvar
    const userExists = await this.model.user.findFirst({ where: { email: data.email } });

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const user = await this.model.user.create({ data });

    return user;
  }
}
