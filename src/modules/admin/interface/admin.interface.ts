import { Admin } from '@prisma/client';
import { CreateAdminDto } from '../dto/create-admin.dto';

export interface IAdminRepository {
  findByLogin(login: string): Promise<Admin | null>;
  create(data: CreateAdminDto): Promise<Admin>;
}