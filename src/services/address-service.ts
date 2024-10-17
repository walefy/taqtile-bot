import { Service } from 'typedi';
import { AddressRepository } from '../repositories/address-repository';
import { AddressInput } from '../dtos/inputs/address-input';
import { AddressModel } from '../dtos/models/address-model';
import { UserRepository } from '../repositories/user-repository';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';

@Service()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: AddressInput): Promise<AddressModel> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.addressRepository.create(data);
  }

  async findAddressByUserId(userId: number): Promise<AddressModel[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.addressRepository.findByUserId(userId);
  }
}
