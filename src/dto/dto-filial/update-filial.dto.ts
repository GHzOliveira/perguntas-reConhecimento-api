import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateFilialDto {
  @ApiPropertyOptional({ 
    description: 'Nome da filial', 
    example: 'Filial Centro Atualizada',
    minLength: 3,
    maxLength: 100
  })
  @IsString({ message: 'O nome da filial deve ser uma string' })
  @IsOptional()
  @MinLength(3, { message: 'O nome da filial deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome da filial deve ter no máximo 100 caracteres' })
  filial?: string;

  @ApiPropertyOptional({ 
    description: 'Quantidade de colaboradores na filial',
    example: 75,
    minimum: 1
  })
  @IsInt({ message: 'A quantidade de colaboradores deve ser um número inteiro' })
  @IsOptional()
  @Min(1, { message: 'A quantidade de colaboradores deve ser pelo menos 1' })
  quantidadeColaboradores?: number;
}