import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    private readonly errorCode?: string,
    private readonly details?: Record<string, any>,
  ) {
    super(
      {
        message,
        errorCode: errorCode || 'COMPANY_ERROR',
        timestamp: new Date().toISOString(),
        details: details || {},
        statusCode: status,
      },
      status,
    );
  }
}

export class CompanyNotFoundException extends CompanyException {
  constructor(id: number) {
    super(
      `Empresa com ID ${id} não encontrada`,
      HttpStatus.NOT_FOUND,
      'COMPANY_NOT_FOUND',
    );
  }
}

export class CompanyCreateException extends CompanyException {
  constructor(details?: Record<string, any>) {
    super(
      'Erro ao criar empresa',
      HttpStatus.BAD_REQUEST,
      'COMPANY_CREATE_ERROR',
      details,
    );
  }
}

export class CompanyDeleteException extends CompanyException {
  constructor(id: number, details?: Record<string, any>) {
    super(
      `Erro ao deletar empresa ${id}`,
      HttpStatus.BAD_REQUEST,
      'COMPANY_DELETE_ERROR',
      details,
    );
  }
}

export class CompanyUpdateException extends CompanyException {
  constructor(id: number, details?: Record<string, any>) {
    super(
      `Erro ao atualizar empresa ${id}`,
      HttpStatus.BAD_REQUEST,
      'COMPANY_UPDATE_ERROR',
      details,
    );
  }
}

export class CompanyValidationException extends CompanyException {
  constructor(details: Record<string, any>) {
    super(
      'Erro de validação nos dados da empresa',
      HttpStatus.BAD_REQUEST,
      'COMPANY_VALIDATION_ERROR',
      details,
    );
  }
}