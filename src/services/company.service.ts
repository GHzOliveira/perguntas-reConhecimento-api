import { Injectable, Logger } from '@nestjs/common';
import { Company } from '@prisma/client';
import { CompanyRepository } from 'src/repositories/company.repositorie';
import { CompanyValidationException } from 'src/exceptions/company.exception';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(name?: string): Promise<Company> {
    this.logger.log(`Criando nova company${name ? `: ${name}` : ''}`);
    
    if (name && name.length < 3) {
      throw new CompanyValidationException({
        field: 'name',
        message: 'Nome da empresa deve ter pelo menos 3 caracteres'
      });
    }

    return await this.companyRepository.create(name);
  }

  async delete(id: number): Promise<Company> {
    this.logger.log(`Deletando company: ${id}`);
    
    if (id <= 0) {
      throw new CompanyValidationException({
        field: 'id',
        message: 'ID da empresa deve ser um número positivo'
      });
    }

    return await this.companyRepository.delete(id);
  }

  async findById(id: number): Promise<Company | null> {
    this.logger.log(`Buscando company: ${id}`);
    
    if (id <= 0) {
      throw new CompanyValidationException({
        field: 'id',
        message: 'ID da empresa deve ser um número positivo'
      });
    }

    return await this.companyRepository.findById(id);
  }

  async findAll(): Promise<Company[]> {
    this.logger.log('Buscando todas as companies');
    return await this.companyRepository.findAll();
  }
}