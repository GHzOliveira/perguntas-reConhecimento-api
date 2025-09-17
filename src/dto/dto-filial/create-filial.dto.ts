import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsInt, Min, IsNumber, IsOptional, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';

export class CreateFilialDto {
  @ApiProperty({ 
    description: 'Nome da filial',
    example: 'Filial Centro',
    minLength: 3,
    maxLength: 100
  })
  @IsString({ message: 'O nome da filial deve ser uma string' })
  @MinLength(3, { message: 'O nome da filial deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome da filial deve ter no máximo 100 caracteres' })
  filial: string;

  @ApiProperty({ 
    description: 'Quantidade de colaboradores na filial',
    example: 50,
    minimum: 1
  })
  @IsInt({ message: 'A quantidade de colaboradores deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade de colaboradores deve ser pelo menos 1' })
  quantidadeColaboradores: number;

  @ApiPropertyOptional({ 
    description: 'ID da empresa à qual a filial pertence', 
    example: 1,
    minimum: 1
  })
  @IsNumber({}, { message: 'O ID da empresa deve ser um número' })
  @IsOptional()
  companyId?: number;
}

export class CreateFiliaisDto {
  @ApiProperty({
    description: 'Lista de filiais a serem criadas',
    type: [CreateFilialDto],
    isArray: true
  })
  @IsArray({ message: 'A lista de filiais deve ser um array' })
  @ValidateNested({ each: true, message: 'Cada item da lista deve ser uma filial válida' })
  @ArrayMinSize(1, { message: 'A lista deve conter pelo menos uma filial' })
  @Type(() => CreateFilialDto)
  filiais: CreateFilialDto[];
}