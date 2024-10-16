import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { UserInput } from '../dtos/inputs/user-input';
import { UserWithAddress } from '../types/user';
import { findAllArgs, IUserRepository } from '../types/iuser-repository';

@Service()
export class UserRepository implements IUserRepository {
  private readonly model = this.prismaClient.user;

  constructor(private readonly prismaClient: PrismaClient) {}

  create(data: UserInput): Promise<UserWithAddress> {
    return this.model.create({ data, include: { address: true } });
  }

  findByEmail(email: string): Promise<UserWithAddress | null> {
    return this.model.findFirst({ where: { email }, include: { address: true } });
  }

  findById(id: number): Promise<UserWithAddress | null> {
    return this.model.findUnique({ where: { id }, include: { address: true } });
  }

  findAll(config: findAllArgs): Promise<UserWithAddress[]> {
    let skip = 0;
    const { page, pageLimit } = config;

    if (page && pageLimit) {
      skip = pageLimit * (page - 1);
    }

    return this.model.findMany({
      orderBy: { name: 'asc' },
      include: { address: true },
      take: pageLimit,
      skip,
    });
  }
}
