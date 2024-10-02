export class CustomException extends Error {
  public code: number;
  public readonly message: string;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
