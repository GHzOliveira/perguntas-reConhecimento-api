import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    required: false,
    minimum: 3
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;
}