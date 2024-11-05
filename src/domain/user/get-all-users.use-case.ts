import { Command } from '@core/command';
import { findAllArgs, UserDbDataSource } from '@data/user/user.db.data-source';
import { UserWithAddressModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class GetAllUsersUseCase implements Command<findAllArgs, UserWithAddressModel[]> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  execute(input: findAllArgs): Promise<UserWithAddressModel[]> {
    return this.userDataSource.findAll(input);
  }
}
