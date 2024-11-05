import { Command } from '@core/contracts';
import { UserNotFoundError } from '@core/error';
import { AddressDbDataSource } from '@data/user/address.db.data-source';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { AddressInputModel, AddressModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateAddressUseCase implements Command<AddressInputModel, AddressModel> {
  constructor(
    private readonly addressDataSource: AddressDbDataSource,
    private readonly userDataSource: UserDbDataSource,
  ) {}

  async execute(input: AddressInputModel): Promise<AddressModel> {
    const user = await this.userDataSource.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressDataSource.create(input);
  }
}
