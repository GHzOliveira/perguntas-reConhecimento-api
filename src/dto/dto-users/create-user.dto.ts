import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, Min, IsObject, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Cidade do usuário' })
  @IsString()
  cidade: string;

  @ApiProperty({ description: 'Função Macro do usuário' })
  @IsString()
  funcaoMacro: string;

  @ApiProperty({ description: 'Data de admissão' })
  @IsString()
  dataAdmissao: string;

  @ApiProperty({ description: 'Gênero do usuário' })
  @IsString()
  genero: string;
  
  @ApiProperty({ description: 'ID da filial', minimum: 1 })
  @IsNumber()
  @Min(1)
  filialId: number;
  
  @ApiProperty({ description: 'ID da empresa', minimum: 1 })
  @IsNumber()
  @Min(1)
  companyId: number;
  
  @ApiProperty({ description: 'Indica se o usuário respondeu o formulário', default: false })
  @IsBoolean()
  respondeuForm: boolean;
  
  @ApiPropertyOptional({
    description: 'Resposta dinâmica com os campos não fixos',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsObject()
  dynamicResponses?: Record<string, any>;
}