import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class BulkCreateUsersDto {
  @ApiProperty({ 
    description: 'Quantidade de usuários a serem criados', 
    default: 10,
    minimum: 1,
    maximum: 1000
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(1000)
  quantity: number;

  @ApiProperty({ description: 'ID da empresa', minimum: 1 })
  @IsNumber()
  @Min(1)
  companyId: number;

  @ApiProperty({ description: 'ID da filial', minimum: 1 })
  @IsNumber()
  @Min(1)
  filialId: number;
}