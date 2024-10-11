import { CustomException } from './custom-exception';

export class AuthenticationException extends CustomException {
  constructor(message: string) {
    super(401, message);
  }
}
