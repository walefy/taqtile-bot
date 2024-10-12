import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { UserInput } from '../dtos/inputs/user-input';
import { User } from '../types/user';

@Service()
export class UserRepository {
  private readonly model = this.prismaClient.user;

  constructor(private readonly prismaClient: PrismaClient) {}

  async create(data: UserInput): Promise<User> {
    return this.model.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findFirst({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.model.findUnique({ where: { id } });
  }
}
