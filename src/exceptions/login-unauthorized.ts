import { CustomException } from './custom-exception';

export class LoginUnauthorizedException extends CustomException {
  constructor() {
    super(401, 'Login unauthorized!');
  }
}
