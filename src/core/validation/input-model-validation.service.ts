import { InputParseError } from '@domain/error/input-parse.error';
import { validate as classValidatorValidate } from 'class-validator';
import { Service } from 'typedi';

@Service()
export class InputModelValidationService {
  async validate<T>(input: object): Promise<T> {
    const validationErrors = await classValidatorValidate(input);

    if (validationErrors.length > 0) {
      const additionalInfo = [];

      for (const validationError of validationErrors) {
        const { property, constraints, value } = validationError;
        additionalInfo.push({ field: property, value, constraints });
      }

      throw new InputParseError('Validation failed!', additionalInfo);
    }

    return input as T;
  }
}
