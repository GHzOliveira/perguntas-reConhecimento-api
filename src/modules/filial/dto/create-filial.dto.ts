import { Type } from "class-transformer";
import { IsString, MinLength, MaxLength, IsInt, Min, IsNumber, IsOptional, IsArray, ArrayMinSize, ValidateNested } from "class-validator";

export class CreateFilialDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  filial: string;

  @IsInt()
  @Min(1)
  quantidadeColaboradores: number;

  @IsNumber()
  @IsOptional()
  companyId?: number;
}

export class CreateFiliaisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateFilialDto)
  filiais: CreateFilialDto[];
}