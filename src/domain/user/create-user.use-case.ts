import { Command } from '@core/contracts';
import { UserAlreadyExistsError } from '@core/error';
import { PasswordService } from '@core/security';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { UserInputModel, UserWithAddressAndPasswordModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class CreateUserUseCase implements Command<UserInputModel, UserWithAddressAndPasswordModel> {
  constructor(private readonly userDataSource: UserDbDataSource) {}

  async execute(input: UserInputModel): Promise<UserWithAddressAndPasswordModel> {
    const userExists = await this.userDataSource.findByEmail(input.email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    input.password = PasswordService.hashPassword(input.password);
    const user = await this.userDataSource.create(input);

    return user;
  }
}
