import { CustomException } from './custom-exception';

export class UserNotFoundException extends CustomException {
  constructor() {
    super(404, 'User not found!');
  }
}
