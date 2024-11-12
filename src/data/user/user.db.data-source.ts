import { dbClient } from '@data/db/config/db.client';
import { UserInputModel, UserWithAddressAndPasswordModel } from '@domain/model';
import { Service } from 'typedi';

export type findAllArgs = {
  page?: number;
  pageLimit?: number;
};

@Service()
export class UserDbDataSource {
  private readonly model = dbClient.user;

  create(data: UserInputModel): Promise<UserWithAddressAndPasswordModel> {
    return this.model.create({ data, include: { address: true } });
  }

  async createMany(data: UserInputModel[]): Promise<UserWithAddressAndPasswordModel[]> {
    await this.model.createMany({ data });

    const emails = data.map(({ email }) => email);
    return this.findByEmails(emails);
  }

  findByEmail(email: string): Promise<UserWithAddressAndPasswordModel | null> {
    return this.model.findFirst({ where: { email }, include: { address: true } });
  }

  findByEmails(emails: string[]): Promise<UserWithAddressAndPasswordModel[]> {
    return this.model.findMany({ where: { email: { in: emails } }, include: { address: true } });
  }

  findById(id: number): Promise<UserWithAddressAndPasswordModel | null> {
    return this.model.findUnique({ where: { id }, include: { address: true } });
  }

  findAll(config: findAllArgs): Promise<UserWithAddressAndPasswordModel[]> {
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
