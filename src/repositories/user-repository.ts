import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { UserInput } from '../dtos/inputs/user-input';
import { User } from '../types/user';
import { findAllArgs, IUserRepository } from '../types/iuser-repository';

@Service()
export class UserRepository implements IUserRepository {
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

  async findAll(config: findAllArgs): Promise<User[]> {
    let skip = 0;
    const { page, pageLimit } = config;

    if (page && pageLimit) {
      skip = pageLimit * (page - 1);
    }

    return this.model.findMany({
      orderBy: { name: 'asc' },
      take: pageLimit,
      skip,
    });
  }
}
