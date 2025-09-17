import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company } from '@prisma/client';
import { ICompanyRepository } from '../interface/company.interface';
import { v4 as uuidv4 } from 'uuid';
import { 
  CompanyException, 
  CompanyNotFoundException,
  CompanyCreateException,
  CompanyDeleteException
} from 'src/exceptions/company.exception';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  private readonly logger = new Logger(CompanyRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(name?: string): Promise<Company> {
    try {
      const timestamp = new Date().getTime();
      const defaultName = `Empresa ${timestamp}`;
      
      return await this.prisma.company.create({
        data: {
          name: name || defaultName,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao criar company: ${error.message}`);
      throw new CompanyCreateException({ error: error.message });
    }
  }

  async delete(id: number): Promise<Company> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        await prisma.filial.deleteMany({
          where: { companyId: id }
        });
  
        return await prisma.company.delete({
          where: { id }
        });
      });
    } catch (error) {
      this.logger.error(`Erro ao deletar company ${id}: ${error.message}`);
      throw new CompanyDeleteException(id, { error: error.message });
    }
  }

  async findById(id: number): Promise<Company | null> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
      });
      
      if (!company) {
        throw new CompanyNotFoundException(id);
      }
      
      return company;
    } catch (error) {
      this.logger.error(`Erro ao buscar company ${id}: ${error.message}`);
      if (error instanceof CompanyException) {
        throw error;
      }
      throw new CompanyException(
        `Erro ao buscar company ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'COMPANY_FIND_ERROR',
        { error: error.message }
      );
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return await this.prisma.company.findMany();
    } catch (error) {
      this.logger.error(`Erro ao buscar companies: ${error.message}`);
      throw new CompanyException(
        'Erro ao buscar companies',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'COMPANY_FIND_ALL_ERROR',
        { error: error.message }
      );
    }
  }
}