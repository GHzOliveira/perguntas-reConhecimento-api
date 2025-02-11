import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FormVisibilityService {
  constructor(private prisma: PrismaService) {}

  async getFormVisibility(companyId: number) {
    return this.prisma.formVisibility.findMany({ where: { companyId } });
  }

  async setFormVisibility(
    companyId: number,
    fields: { field: string; isVisible: boolean }[],
  ) {
    await this.prisma.formVisibility.deleteMany({ where: { companyId } }); // Remove configurações anteriores

    return this.prisma.formVisibility.createMany({
      data: fields.map((f) => ({
        companyId,
        field: f.field,
        isVisible: f.isVisible,
      })),
    });
  }

  async updateVisibility(companyId: number, field: string, isVisible: boolean) {
    return this.prisma.formVisibility.upsert({
      where: { companyId_field: { companyId, field } }, // Uso da chave composta
      update: { isVisible },
      create: { companyId, field, isVisible },
    });
  }
}