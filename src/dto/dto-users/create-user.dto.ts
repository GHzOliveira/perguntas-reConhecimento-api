import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsBoolean, Min, IsObject, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  nome: string;
  
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;
  
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