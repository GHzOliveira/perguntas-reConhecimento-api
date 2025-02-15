import { CreateFiliaisDto, CreateFilialDto } from '../dto/create-filial.dto';
import { Filial } from '@prisma/client';

export interface IFilialRepository {
  create(data: CreateFilialDto): Promise<Filial>;
  createMany(data: CreateFiliaisDto): Promise<{ filiais: Filial[], linkUnico: string }>;
  delete(id: number): Promise<Filial>;
  findAll(): Promise<Partial<Filial>[]>;
  findOne(id: number): Promise<Filial | null>;
}