import { Service } from 'typedi';
import { AddressRepository } from '../repositories/address-repository';
import { UserNotFoundError } from '@core/error';
import { AddressInputModel, AddressModel } from '@domain/model';
import { UserDbDataSource } from '@data/user/user.db.data-source';

@Service()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userDataSource: UserDbDataSource,
  ) {}

  async create(data: AddressInputModel): Promise<AddressModel> {
    const user = await this.userDataSource.findById(data.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressRepository.create(data);
  }

  async findAddressByUserId(userId: number): Promise<AddressModel[]> {
    const user = await this.userDataSource.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressRepository.findByUserId(userId);
  }
}
