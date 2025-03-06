import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FormBuildFieldDto {
  @IsString()
  field: string;

  @IsBoolean()
  isVisible: boolean;
}

export class SetFormVisibilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormBuildFieldDto)
  fields: FormBuildFieldDto[];
}

export class UpdateFormBuildDto {
  @IsNumber()
  companyId: number;

  @IsString()
  field: string;

  @IsBoolean()
  isVisible: boolean;
}

export class SaveFormDto {
  @IsNumber()
  companyId: number;
  
  @IsNotEmpty()
  @IsObject()
  formData: {
    schema: any;
    uiSchema?: any;
    formOptions?: any;
  };
  
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsOptional()
  @IsString()
  description?: string;
}