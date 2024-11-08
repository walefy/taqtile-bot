import { Service } from 'typedi';
import { AddressInputModel, AddressModel } from '@domain/model';
import { dbClient } from '@data/db/config/db.client';

@Service()
export class AddressDbDataSource {
  private readonly model = dbClient.address;

  create(data: AddressInputModel): Promise<AddressModel> {
    return this.model.create({ data, include: { user: true } });
  }

  findByUserId(userId: number): Promise<AddressModel[]> {
    return this.model.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  findAll(): Promise<AddressModel[]> {
    return this.model.findMany({ include: { user: true } });
  }
}
