import { HttpException, HttpStatus } from '@nestjs/common';

export class FormVisibilityException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        status: statusCode,
        error: message,
      },
      statusCode,
    );
  }
}