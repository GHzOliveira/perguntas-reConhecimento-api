import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FormVisibilityFieldDto {
  @IsString()
  field: string;

  @IsBoolean()
  isVisible: boolean;
}

export class SetFormVisibilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormVisibilityFieldDto)
  fields: FormVisibilityFieldDto[];
}

export class UpdateFormVisibilityDto {
  @IsNumber()
  companyId: number;

  @IsString()
  field: string;

  @IsBoolean()
  isVisible: boolean;
}