import { PrismaClient } from '@prisma/client';
import { UserInput } from '../dtos/inputs/user-input';
import { UserModel } from '../dtos/models/user-model';

export class UserService {
  // TODO: criar minha própria model e inverter a dependência
  private model = new PrismaClient();

  async createUser(data: UserInput): Promise<UserModel> {
    // TODO: fazer hash da senha antes de salvar
    // TODO: verificar se existe outro usuário cadastrado com esse email
    const user = await this.model.user.create({ data });

    return user;
  }
}
