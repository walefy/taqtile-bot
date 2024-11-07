import { CustomError } from './custom.error';

export class InvalidFileError extends CustomError {
  constructor(message: string) {
    super(400, message);
  }
}
