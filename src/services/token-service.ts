import jwt from 'jsonwebtoken';
import process from 'process';
import { Service } from 'typedi';

@Service()
export class TokenService {
  private readonly secret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not found');
    }

    this.secret = process.env.JWT_SECRET;
  }

  public generateToken(subject: string, payload: Record<string, unknown>) {
    return jwt.sign(payload, this.secret, { subject, expiresIn: '1d' });
  }

  public verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}
