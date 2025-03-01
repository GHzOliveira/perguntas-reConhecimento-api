import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormData, IFormBuilderRepository } from '../interface/form-builder.interface';

@Injectable()
export class FormBuilderRepository implements IFormBuilderRepository {
  private readonly logger = new Logger(FormBuilderRepository.name);

  constructor(private readonly prisma: PrismaService) {}
  
  async getLatestForm(companyId?: number): Promise<FormData | null> {
    // Implementar busca do formulário mais recente
    try {
      // Você precisará adaptar isto baseado no seu schema do Prisma
      const latestForm = await this.prisma.dynamicForm.findFirst({
        where: companyId ? { companyId } : {},
        orderBy: { createdAt: 'desc' },
      });
      
      return latestForm;
    } catch (error) {
      this.logger.error(`Erro ao buscar formulário: ${error.message}`);
      return null;
    }
  }
  
  async saveForm(formData: FormData): Promise<FormData> {
    try {
      // Você precisará adaptar isto baseado no seu schema do Prisma
      const savedForm = await this.prisma.dynamicForm.create({
        data: {
          companyId: formData.companyId,
          formData: formData.formData,
          name: formData.name || 'Formulário sem nome',
        },
      });
      
      return savedForm;
    } catch (error) {
      this.logger.error(`Erro ao salvar formulário: ${error.message}`);
      throw error;
    }
  }
  
  async getAllForms(companyId?: number): Promise<FormData[]> {
    try {
      // Você precisará adaptar isto baseado no seu schema do Prisma
      const forms = await this.prisma.dynamicForm.findMany({
        where: companyId ? { companyId } : {},
        orderBy: { createdAt: 'desc' },
      });
      
      return forms;
    } catch (error) {
      this.logger.error(`Erro ao buscar formulários: ${error.message}`);
      return [];
    }
  }
}