import { Command } from '@core/contracts';
import { UserNotFoundError } from '@domain/error';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { UserWithAddressAndPasswordModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class GetUserUseCase implements Command<number, UserWithAddressAndPasswordModel> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  async execute(input: number): Promise<UserWithAddressAndPasswordModel> {
    const user = await this.userDataSource.findById(input);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
