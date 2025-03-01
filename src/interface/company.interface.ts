import { Company } from '@prisma/client';

export interface ICompanyRepository {
  create(name: string): Promise<Company>;
  delete(id: number): Promise<Company>;
  findById(id: number): Promise<Company | null>;
  findAll(): Promise<Company[]>;
}