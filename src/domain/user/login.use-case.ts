import { Command } from '@core/command';
import { LoginUnauthorizedError } from '@core/error';
import { PasswordService, TokenService } from '@core/security';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { LoginInputModel, LoginModel } from '@domain/model';
import { Service } from 'typedi';

@Service()
export class LoginUseCase implements Command<LoginInputModel, LoginModel> {
  constructor(
    private readonly userDataSource: UserDbDataSource,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInputModel): Promise<LoginModel> {
    const user = await this.userDataSource.findByEmail(input.email);

    if (!user) {
      throw new LoginUnauthorizedError();
    }

    const passwordMatch = PasswordService.verifyPassword(input.password, user.password);

    if (!passwordMatch) {
      throw new LoginUnauthorizedError();
    }

    const token = this.tokenService.generateToken(user.email, { id: user.id }, input.rememberMe);

    return { user, token };
  }
}
