
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormData, IFormBuilderRepository } from '../interface/form-builder.interface';

@Injectable()
export class FormBuilderRepository implements IFormBuilderRepository {
  private readonly logger = new Logger(FormBuilderRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private transformFormData(prismaData: any): FormData | null {
    if (!prismaData) return null;

    const parsedFormData = typeof prismaData.formData === 'string' 
      ? JSON.parse(prismaData.formData) 
      : prismaData.formData;
    
    return {
      id: prismaData.id,
      companyId: prismaData.companyId,
      name: prismaData.name,
      formData: {
        schema: parsedFormData.schema || {},
        uiSchema: parsedFormData.uiSchema || {},
        formOptions: parsedFormData.formOptions || {}
      },
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      isDefault: prismaData.isDefault
    };
  }

  async getLatestForm(companyId?: number): Promise<FormData | null> {
    try {
      const latestForm = await this.prisma.dynamicForm.findFirst({
        where: companyId ? { companyId } : {},
        orderBy: { createdAt: 'desc' },
      });
      
      return this.transformFormData(latestForm);
    } catch (error) {
      this.logger.error(`Erro ao buscar formulário: ${error.message}`);
      return null;
    }
  }
  
  async getFormById(id: number): Promise<FormData | null> {
    try {
      const form = await this.prisma.dynamicForm.findUnique({
        where: { id }
      });
      
      return this.transformFormData(form);
    } catch (error) {
      this.logger.error(`Erro ao buscar formulário por ID: ${error.message}`);
      return null;
    }
  }
  
  async saveForm(formData: FormData): Promise<FormData> {
    try {
      const savedForm = await this.prisma.dynamicForm.create({
        data: {
          companyId: formData.companyId,
          formData: formData.formData,
          name: formData.name || 'Formulário sem nome',
        },
      });
      
      return this.transformFormData(savedForm);
    } catch (error) {
      this.logger.error(`Erro ao salvar formulário: ${error.message}`);
      throw error;
    }
  }
  
  async updateForm(id: number, formData: Partial<FormData>): Promise<FormData> {
    try {
      const updatedForm = await this.prisma.dynamicForm.update({
        where: { id },
        data: {
          ...formData,
          updatedAt: new Date()
        },
      });
      
      return this.transformFormData(updatedForm);
    } catch (error) {
      this.logger.error(`Erro ao atualizar formulário: ${error.message}`);
      throw error;
    }
  }
  
  async getAllForms(companyId?: number): Promise<FormData[]> {
    try {
      const forms = await this.prisma.dynamicForm.findMany({
        where: companyId ? { companyId } : {},
        orderBy: { createdAt: 'desc' },
      });
      
      return forms.map(form => this.transformFormData(form)).filter(form => form !== null) as FormData[];
    } catch (error) {
      this.logger.error(`Erro ao buscar formulários: ${error.message}`);
      return [];
    }
  }
  
  async deleteForm(id: number): Promise<boolean> {
    try {
      await this.prisma.dynamicForm.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      this.logger.error(`Erro ao excluir formulário: ${error.message}`);
      return false;
    }
  }
  
  async clearDefaultForms(companyId: number): Promise<void> {
    try {
      await this.prisma.dynamicForm.updateMany({
        where: { companyId, isDefault: true },
        data: { isDefault: false }
      });
    } catch (error) {
      this.logger.error(`Erro ao limpar formulários padrão: ${error.message}`);
      throw error;
    }
  }
  
  async setAsDefault(id: number): Promise<FormData> {
    try {
      const form = await this.prisma.dynamicForm.update({
        where: { id },
        data: { isDefault: true }
      });
      
      const transformedForm = this.transformFormData(form);
      if (!transformedForm) {
        throw new Error('Erro ao transformar dados do formulário');
      }
      return transformedForm;
    } catch (error) {
      this.logger.error(`Erro ao definir formulário como padrão: ${error.message}`);
      throw error;
    }
  }
}