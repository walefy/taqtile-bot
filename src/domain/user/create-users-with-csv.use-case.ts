import { Command } from '@core/contracts';
import { PasswordService } from '@core/security';
import { CsvService } from '@core/security/csv/csv.service';
import { InputModelValidationService } from '@core/validation/input-model-validation.service';
import { AddressDbDataSource } from '@data/address/address.db.data-source';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { InvalidFileError, UserAlreadyExistsError } from '@domain/error';
import { FileModel, UserWithAddressModel, UserCsvModel, UserReadyToSaveWithAddress } from '@domain/model';
import { Service } from 'typedi';

export type CreateUsersWithCsvUseCaseProps = {
  fileModel: FileModel;
  validatorClass: new () => object;
};

export type EmailWithRawPassword = {
  email: string;
  rawPassword: string;
};

@Service()
export class CreateUsersWithCsvUseCase implements Command<CreateUsersWithCsvUseCaseProps, UserWithAddressModel[]> {
  constructor(
    private readonly userDataSource: UserDbDataSource,
    private readonly addressDataSource: AddressDbDataSource,
    private readonly csvService: CsvService,
    private readonly validationService: InputModelValidationService,
  ) {}

  async execute(props: CreateUsersWithCsvUseCaseProps): Promise<UserWithAddressModel[]> {
    const { fileModel: data, validatorClass } = props;

    if (data.mimetype !== 'text/csv') {
      throw new InvalidFileError('File uploaded with invalid format! Expect csv file.');
    }

    const entryObjects = await this.csvService.toObject(data.readStream);

    const usersReadyToSave = entryObjects.map(async (rawObj) => {
      const { hashedPassword } = PasswordService.generateRandomPassword();
      const userModel = await this.generateAValidUserCsvInstance(rawObj, validatorClass);
      const userReadyToSave = await this.convertUserCsvToUserReadyToSave(hashedPassword, userModel);

      return userReadyToSave;
    });

    const usersToRegister: UserReadyToSaveWithAddress[] = await Promise.all(usersReadyToSave);

    const emails = usersToRegister.map(({ user }) => user.email);
    await this.validateConstraintUniqueEmail(emails);

    const users = await this.userDataSource.createMany(usersToRegister.map((data) => data.user));

    const address = usersToRegister.map((data) => {
      const userId = users.find((user) => user.email === data.user.email)!.id;

      return { ...data.address[0], userId };
    });

    await this.addressDataSource.createMany(address);

    return this.userDataSource.findByEmails(emails);
  }

  private async validateConstraintUniqueEmail(emails: string[]) {
    const usersFound = await this.userDataSource.findByEmails(emails);

    if (usersFound.length > 0) {
      const emails = usersFound.map(({ email }) => email).join(', ');
      throw new UserAlreadyExistsError(`User(s) ${emails} already exists`);
    }
  }

  private generateAValidUserCsvInstance(rawObj: unknown, validatorClass: new () => object): Promise<UserCsvModel> {
    const objInstance = Object.assign(new validatorClass(), rawObj);
    return this.validationService.validate<UserCsvModel>(objInstance);
  }

  private async convertUserCsvToUserReadyToSave(
    hashedPassword: string,
    userCsv: UserCsvModel,
  ): Promise<UserReadyToSaveWithAddress> {
    userCsv.password = hashedPassword;

    const user = {
      name: userCsv['nome'],
      birthDate: new Date(userCsv['data de nascimento']),
      email: userCsv['email'],
      password: userCsv['password'],
    };

    return {
      user,
      address: [
        {
          city: userCsv['cidade'],
          neighborhood: userCsv['bairro'],
          state: userCsv['estado'],
          street: userCsv['rua'],
          streetNumber: Number(userCsv['número da casa']),
          zipCode: userCsv['zipCode'],
          complement: userCsv['complemento'],
          userId: 0,
        },
      ],
    };
  }
}
