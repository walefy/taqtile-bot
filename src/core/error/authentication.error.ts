import { CustomError } from './custom.error';

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(401, message);
  }
}
