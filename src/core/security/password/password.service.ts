import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'buffer';

export type RandomPasswordReturn = {
  rawPassword: string;
  hashedPassword: string;
};

export class PasswordService {
  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const buf = scryptSync(password, salt, 64);
    return `${buf.toString('hex')}.${salt}`;
  }

  static verifyPassword(planPassword: string, hashedPassword: string): boolean {
    const [hashedPasswordPartOne, salt] = hashedPassword.split('.');
    const hashedPasswordBuf = Buffer.from(hashedPasswordPartOne, 'hex');
    const planPasswordBuf = scryptSync(planPassword, salt, 64);

    return timingSafeEqual(hashedPasswordBuf, planPasswordBuf);
  }

  static generateRandomPassword(): RandomPasswordReturn {
    const rawPassword = randomBytes(8).toString('hex');
    const hashedPassword = PasswordService.hashPassword(rawPassword);

    return { rawPassword, hashedPassword };
  }
}
