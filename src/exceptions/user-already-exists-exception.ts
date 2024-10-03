import { CustomException } from './custom-exception';

export class UserAlreadyExistsException extends CustomException {
  constructor() {
    super(409, 'User already exists!');
  }
}
