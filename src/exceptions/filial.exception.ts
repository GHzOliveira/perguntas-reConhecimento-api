export class FilialException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FilialException';
  }
}