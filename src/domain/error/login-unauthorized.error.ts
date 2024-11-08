import { CustomError } from './custom.error';

export class LoginUnauthorizedError extends CustomError {
  constructor() {
    super(401, 'Login unauthorized!');
  }
}
