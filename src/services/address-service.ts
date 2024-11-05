import { Service } from 'typedi';
import { AddressRepository } from '../repositories/address-repository';
import { UserRepository } from '../repositories/user-repository';
import { UserNotFoundError } from '@core/error';
import { AddressInputModel, AddressModel } from '@domain/model';

@Service()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: AddressInputModel): Promise<AddressModel> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressRepository.create(data);
  }

  async findAddressByUserId(userId: number): Promise<AddressModel[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressRepository.findByUserId(userId);
  }
}
