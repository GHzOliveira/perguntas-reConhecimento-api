import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StandardResponseDto } from '../common/standard-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'João da Silva' })
  nomeCompleto: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@exemplo.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Data de nascimento', example: '1990-01-01T00:00:00.000Z' })
  dataNascimento?: Date;

  @ApiPropertyOptional({ description: 'CPF do usuário', example: '123.456.789-00' })
  cpf?: string;

  @ApiPropertyOptional({ description: 'ID da filial', example: 1 })
  filialId: number;

  @ApiPropertyOptional({ description: 'ID da empresa', example: 1 })
  companyId: number;
}

export class UserResponseArrayDto extends StandardResponseDto<UserResponseDto[]> {}
export class SingleUserResponseDto extends StandardResponseDto<UserResponseDto> {}