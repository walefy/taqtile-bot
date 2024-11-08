import { Command } from '@core/contracts';
import { UserNotFoundError } from '@domain/error';
import { AddressDbDataSource } from '@data/user/address.db.data-source';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { AddressModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class FindAddressByUserIdUseCase implements Command<number, AddressModel[]> {
  constructor(
    private readonly addressDataSource: AddressDbDataSource,
    private readonly userDataSource: UserDbDataSource,
  ) {}

  async execute(input: number): Promise<AddressModel[]> {
    const user = await this.userDataSource.findById(input);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.addressDataSource.findByUserId(input);
  }
}
