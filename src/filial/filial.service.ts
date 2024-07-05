import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilialService {
    constructor(private prisma: PrismaService) {}

  async create(filial: string, quantidadeColaboradores: number) {
    return this.prisma.filial.create({
      data: {
        filial,
        quantidadeColaboradores,
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
