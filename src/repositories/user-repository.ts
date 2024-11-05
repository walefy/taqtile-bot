import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { findAllArgs, IUserRepository } from '../types/iuser-repository';
import { UserInputModel, UserWithAddressModel } from '@domain/model';

@Service()
export class UserRepository implements IUserRepository {
  private readonly model = this.prismaClient.user;

  constructor(private readonly prismaClient: PrismaClient) {}

  create(data: UserInputModel): Promise<UserWithAddressModel> {
    return this.model.create({ data, include: { address: true } });
  }

  findByEmail(email: string): Promise<UserWithAddressModel | null> {
    return this.model.findFirst({ where: { email }, include: { address: true } });
  }

  findById(id: number): Promise<UserWithAddressModel | null> {
    return this.model.findUnique({ where: { id }, include: { address: true } });
  }

  findAll(config: findAllArgs): Promise<UserWithAddressModel[]> {
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
