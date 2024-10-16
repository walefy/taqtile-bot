import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { AddressInput } from '../dtos/inputs/address-input';
import { Address } from '../types/address';

@Service()
export class AddressRepository {
  private readonly model = this.prismaClient.address;

  constructor(private readonly prismaClient: PrismaClient) {}

  create(data: AddressInput): Promise<Address> {
    return this.model.create({ data, include: { user: true } });
  }

  findByUserId(userId: number): Promise<Address[]> {
    return this.model.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  findAll(): Promise<Address[]> {
    return this.model.findMany({ include: { user: true } });
  }
}
