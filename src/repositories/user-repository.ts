import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { UserInput } from '../dtos/inputs/user-input';
import { UserModel } from '../dtos/models/user-model';

@Service()
export class UserRepository {
  private readonly prismaClient = new PrismaClient();
  private readonly model = this.prismaClient.user;

  async create(data: UserInput): Promise<UserModel> {
    return this.model.create({ data });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.model.findFirst({ where: { email } });
  }
}
