export class TokenHelper {
  static tokenExpirationInDays(expSeconds: number): number {
    const now = Math.floor(Date.now() / 1000);
    const differenceInSeconds = expSeconds - now;

    const days = Math.floor(differenceInSeconds / (60 * 60 * 24));

    return days;
  }
}
