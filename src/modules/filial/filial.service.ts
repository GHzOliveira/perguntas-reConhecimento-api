import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilialDto } from './dto/create-filial.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilialService {
    constructor(private prisma: PrismaService) {}

    async create(createFilialDto: CreateFilialDto) {
      // Cria uma nova empresa (Company) com um nome único utilizando o uuid
      const company = await this.prisma.company.create({
        data: {
          name: `Company-${uuidv4()}`,
        },
      });
  
      // Gera o link único utilizando o id da empresa recém-criada
      const linkUnico = `https://localhost:5173/questionario/${company.id}`;
  
      // Cria a filial associando a empresa e adicionando o link único
      return this.prisma.filial.create({
        data: {
          filial: createFilialDto.filial,
          quantidadeColaboradores: createFilialDto.quantidadeColaboradores,
          companyId: company.id,
          linkUnico,
        },
      });
    }

  async delete(filialId: number) {
    return this.prisma.filial.delete({
      where: {
        id: filialId,
      },
    });
  }

  async findAll() {
    return this.prisma.filial.findMany({
      select: {
        id: true,
        filial: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.filial.findUnique({
      where: { id },
    });
  }
}
