import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StandardResponseDto } from '../common/standard-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@exemplo.com' })
  email: string;

  @ApiProperty({ description: 'ID da filial', example: 1 })
  filialId: number;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  companyId: number;

  @ApiProperty({ description: 'Indica se o usuário respondeu o formulário', example: true })
  respondeuForm: boolean;

  @ApiPropertyOptional({
    description: 'Campos dinâmicos não fixos',
    type: 'object',
    additionalProperties: true
  })
  dynamicResponses?: Record<string, any>;
}

export class UserResponseArrayDto extends StandardResponseDto<UserResponseDto[]> {}
export class SingleUserResponseDto extends StandardResponseDto<UserResponseDto> {}