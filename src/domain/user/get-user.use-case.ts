import { Command } from '@core/command';
import { UserNotFoundError } from '@core/error';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { UserWithAddressModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class GetUserUseCase implements Command<number, UserWithAddressModel> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  async execute(input: number): Promise<UserWithAddressModel> {
    const user = await this.userDataSource.findById(input);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
