import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsDate, IsBoolean, Min, MaxLength, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum ModeloTrabalho {
  PRESENCIAL = 'PRESENCIAL',
  HIBRIDO = 'HIBRIDO',
  REMOTO = 'REMOTO'
}

enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
  NAO_INFORMADO = 'NAO_INFORMADO'
}

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  @MaxLength(100)
  nomeCompleto: string;
  
  @ApiPropertyOptional({ description: 'Data de nascimento' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataNascimento?: Date;
  
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  @MaxLength(100)
  email: string;
  
  @ApiPropertyOptional({ description: 'CPF do usuário' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  cpf?: string;
  
  @ApiPropertyOptional({ description: 'Nível de escolaridade' })
  @IsOptional()
  @IsString()
  escolaridade?: string;
  
  @ApiPropertyOptional({ description: 'Estado civil' })
  @IsOptional()
  @IsString()
  estadoCivil?: string;
  
  @ApiPropertyOptional({ description: 'Quantidade de filhos' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  filhos?: number;
  
  @ApiPropertyOptional({ description: 'Quantidade de livros lidos por ano' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeLivros?: number;
  
  @ApiPropertyOptional({ description: 'Hobbies do usuário' })
  @IsOptional()
  @IsString()
  hobbie?: string;
  
  @ApiPropertyOptional({ description: 'Tempo de deslocamento casa-trabalho' })
  @IsOptional()
  @IsString()
  tempoCasaTrab?: string;
  
  @ApiPropertyOptional({ description: 'Modelo de trabalho', enum: ModeloTrabalho })
  @IsOptional()
  @IsEnum(ModeloTrabalho)
  modeloTrabalho?: string;
  
  @ApiPropertyOptional({ description: 'Participação em grupos' })
  @IsOptional()
  @IsString()
  partGrupos?: string;
  
  @ApiPropertyOptional({ description: 'Tempo de empresa' })
  @IsOptional()
  @IsString()
  tempoEmpresa?: string;
  
  @ApiPropertyOptional({ description: 'Área de trabalho' })
  @IsOptional()
  @IsString()
  areaTrabalho?: string;
  
  @ApiProperty({ description: 'ID da filial', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  filialId: number;
  
  @ApiProperty({ description: 'ID da empresa', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  companyId: number;
  
  @ApiPropertyOptional({ description: 'Função do usuário' })
  @IsOptional()
  @IsString()
  funcao?: string;
  
  @ApiPropertyOptional({ description: 'Gênero do usuário', enum: Genero })
  @IsOptional()
  @IsEnum(Genero)
  genero?: string;
  
  @ApiPropertyOptional({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  cidade?: string;
  
  @ApiPropertyOptional({ description: 'Estado/UF' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  estado?: string;
  
  @ApiPropertyOptional({ description: 'País' })
  @IsOptional()
  @IsString()
  pais?: string;
  
  @ApiPropertyOptional({ description: 'Participou da educação Metanoia', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  educacaoMetanoia?: boolean;
  
  @ApiPropertyOptional({ description: 'Respondeu o formulário', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  respondeuForm?: boolean;
}