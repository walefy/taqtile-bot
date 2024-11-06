import { CustomError } from './custom.error';

export class UserAlreadyExistsError extends CustomError {
  constructor() {
    super(409, 'User already exists!');
  }
}
