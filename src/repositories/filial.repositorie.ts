import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Filial } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IFilialRepository } from 'src/modules/filial/interface/filial.interface';
import {
  CreateFiliaisDto,
  CreateFilialDto,
} from 'src/modules/filial/dto/create-filial.dto';
import { FilialException } from 'src/exceptions/filial.exception';
import { LinkService } from 'src/modules/filial/services/link.service';

@Injectable()
export class FilialRepository implements IFilialRepository {
  private readonly logger = new Logger(FilialRepository.name);
  private readonly domain = 'http://localhost:5173';

  constructor(
    private readonly prisma: PrismaService,
    private readonly linkService: LinkService,
  ) {}

  async createMany(
    createFiliaisDto: CreateFiliaisDto,
  ): Promise<{ filiais: Filial[]; linkUnico: string }> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const company = await prisma.company.create({
          data: {
            name: `Company-${uuidv4()}`,
          },
        });
  
        const companyLink = this.linkService.generateCompanyLink(company.id, this.domain);
  
        await prisma.filial.createMany({
          data: createFiliaisDto.filiais.map((filial) => ({
            filial: filial.filial,
            quantidadeColaboradores: filial.quantidadeColaboradores,
            companyId: company.id,
            linkUnico: companyLink,
          })),
        });
  
        const createdFiliais = await prisma.filial.findMany({
          where: { companyId: company.id },
        });
  
        return {
          filiais: createdFiliais,
          linkUnico: companyLink,
        };
      });
    } catch (error) {
      this.logger.error(`Erro ao criar filiais: ${error.message}`);
      throw new FilialException(`Erro ao criar filiais`);
    }
  }

  async create(createFilialDto: CreateFilialDto): Promise<Filial> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const company = await prisma.company.create({
          data: {
            name: `Company-${uuidv4()}`,
          },
        });
  
        const companyLink = this.linkService.generateCompanyLink(company.id, this.domain);
  
        return await prisma.filial.create({
          data: {
            filial: createFilialDto.filial,
            quantidadeColaboradores: createFilialDto.quantidadeColaboradores,
            companyId: company.id,
            linkUnico: companyLink,
          },
        });
      });
    } catch (error) {
      this.logger.error(`Erro ao criar filial: ${error.message}`);
      throw new FilialException('Erro ao criar filial');
    }
  }

  async delete(id: number): Promise<Filial> {
    try {
      return await this.prisma.filial.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao deletar filial ${id}: ${error.message}`);
      throw new FilialException(`Erro ao deletar filial ${id}`);
    }
  }

  async findAll(): Promise<Partial<Filial>[]> {
    try {
      return await this.prisma.filial.findMany({
        select: {
          id: true,
          filial: true,
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar filiais: ${error.message}`);
      throw new FilialException('Erro ao buscar filiais');
    }
  }

  async findOne(id: number): Promise<Filial | null> {
    try {
      return await this.prisma.filial.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar filial ${id}: ${error.message}`);
      throw new FilialException(`Erro ao buscar filial ${id}`);
    }
  }
}
