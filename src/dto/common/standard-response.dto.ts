import { ApiProperty } from '@nestjs/swagger';

export class StandardResponseDto<T> {
  @ApiProperty({ description: 'Indica se a operação foi bem-sucedida', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensagem de retorno da operação', example: 'Operação realizada com sucesso' })
  message: string;

  @ApiProperty({ description: 'Dados retornados pela operação' })
  data: T;
}