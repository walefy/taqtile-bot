import { CustomError } from './custom.error';

export class UserNotFoundError extends CustomError {
  constructor() {
    super(404, 'User not found!');
  }
}
