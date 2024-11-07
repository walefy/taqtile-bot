import { CustomError } from './custom.error';

export class InputParseError extends CustomError {
  constructor(message: string, additionalInfo: unknown) {
    super(400, message, additionalInfo);
  }
}
