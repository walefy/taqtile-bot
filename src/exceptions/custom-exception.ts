export class CustomException extends Error {
  public readonly code: number;
  public readonly message: string;
  public readonly additionalInfo?: unknown;

  constructor(code: number, message: string, additionalInfo?: unknown) {
    super(message);
    this.code = code;
    this.message = message;
    this.additionalInfo = additionalInfo;
  }
}
