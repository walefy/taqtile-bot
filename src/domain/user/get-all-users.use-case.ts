import { Command } from '@core/contracts';
import { findAllArgs, UserDbDataSource } from '@data/user/user.db.data-source';
import { UserWithAddressAndPasswordModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class GetAllUsersUseCase implements Command<findAllArgs, UserWithAddressAndPasswordModel[]> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  execute(input: findAllArgs): Promise<UserWithAddressAndPasswordModel[]> {
    return this.userDataSource.findAll(input);
  }
}
