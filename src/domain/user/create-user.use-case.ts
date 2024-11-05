import { Command } from '@core/command';
import { UserAlreadyExistsError } from '@core/error';
import { PasswordService } from '@core/security';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { UserInputModel, UserWithAddressModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateUserUseCase implements Command<UserInputModel, UserWithAddressModel> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  async execute(input: UserInputModel): Promise<UserWithAddressModel> {
    const userExists = await this.userDataSource.findByEmail(input.email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    input.password = PasswordService.hashPassword(input.password);
    const user = await this.userDataSource.create(input);

    return user;
  }
}
