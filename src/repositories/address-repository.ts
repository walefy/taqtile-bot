import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { AddressInputModel, AddressModel } from '@domain/model';

@Service()
export class AddressRepository {
  private readonly model = this.prismaClient.address;

  constructor(private readonly prismaClient: PrismaClient) {}

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
