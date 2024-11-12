import { Command } from '@core/contracts';
import { ResendEmailService } from '@core/email';
import { PasswordService } from '@core/security';
import { CsvService } from '@core/security/csv/csv.service';
import { BatchProcessor } from '@core/utility';
import { InputModelValidationService } from '@core/validation';
import { AddressDbDataSource } from '@data/address/address.db.data-source';
import { UserDbDataSource } from '@data/user/user.db.data-source';
import { EmailTemplates } from '@domain/email';
import { InvalidFileError, UserAlreadyExistsError } from '@domain/error';
import { FileModel, UserWithAddressModel, UserCsvModel, UserInputModel, AddressInputModel } from '@domain/model';
import { Service } from 'typedi';

export type CreateUsersWithCsvUseCaseProps = {
  fileModel: FileModel;
  validatorClass: new () => object;
};

export type EmailWithRawPassword = {
  email: string;
  rawPassword: string;
};

export type UserReadyToSaveWithAddress = {
  user: UserInputModel;
  address: AddressInputModel[];
};

@Service()
export class CreateUsersWithCsvUseCase implements Command<CreateUsersWithCsvUseCaseProps, UserWithAddressModel[]> {
  constructor(
    private readonly userDataSource: UserDbDataSource,
    private readonly addressDataSource: AddressDbDataSource,
    private readonly csvService: CsvService,
    private readonly validationService: InputModelValidationService,
    private readonly mailService: ResendEmailService,
  ) {}

  async execute(props: CreateUsersWithCsvUseCaseProps): Promise<UserWithAddressModel[]> {
    const { fileModel: data, validatorClass } = props;

    if (data.mimetype !== 'text/csv') {
      throw new InvalidFileError('File uploaded with invalid format! Expect csv file.');
    }

    const entryObjects = await this.csvService.toObject(data.readStream);

    const usersToRegister = await BatchProcessor.processInBatches<unknown, UserReadyToSaveWithAddress>(
      entryObjects,
      10,
      (rawObj) => this.processRawUserEntry(rawObj, validatorClass),
    );

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

  private async processRawUserEntry(
    rawObj: unknown,
    validatorClass: new () => object,
  ): Promise<UserReadyToSaveWithAddress> {
    const { hashedPassword, rawPassword } = PasswordService.generateRandomPassword();
    const userModel = await this.generateAValidUserCsvInstance(rawObj, validatorClass);
    const userReadyToSave = await this.convertUserCsvToUserReadyToSave(hashedPassword, userModel);

    this.mailService.sendMail({
      to: userReadyToSave.user.email,
      subject: 'Welcome to InstaqBot',
      template: EmailTemplates.CreatedUsersWithCsv,
      variables: {
        name: userReadyToSave.user.name,
        email: userReadyToSave.user.email,
        password: rawPassword,
      },
    });

    return userReadyToSave;
  }

  private async validateConstraintUniqueEmail(emails: string[]): Promise<void> {
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
