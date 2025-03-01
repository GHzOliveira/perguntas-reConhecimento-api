import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsEnum(['ADMIN'])
  role: 'ADMIN';
}