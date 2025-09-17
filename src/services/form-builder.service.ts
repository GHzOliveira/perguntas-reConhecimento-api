import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FormBuilderRepository } from '../repositories/form-builder.repository';
import { SaveFormDto } from 'src/dto/dto-form/form-build.dto';
import { FormListResponseDto } from 'src/dto/dto-form/form-response.dto';

@Injectable()
export class FormBuilderService {
  private readonly logger = new Logger(FormBuilderService.name);

  constructor(private readonly formBuilderRepository: FormBuilderRepository) {}

  /**
   * Busca formulários específicos para uma empresa
   * @param companyId ID da empresa
   * @returns Objeto de resposta padronizada com os formulários ou mensagem de erro
   */
  async getFormsByCompanyId(companyId: number): Promise<FormListResponseDto> {
    if (!companyId) {
      throw new BadRequestException('ID da empresa é obrigatório');
    }
    
    this.logger.log(`Buscando formulários para a empresa ID: ${companyId}`);
    const forms = await this.formBuilderRepository.getAllForms(companyId);
    
    if (!forms || forms.length === 0) {
      return {
        success: false,
        message: 'Não existem formulários associados a esta empresa',
        data: []
      };
    }
    
    return {
      success: true,
      message: `${forms.length} formulário(s) encontrado(s)`,
      data: forms
    };
  }
  
  async getLatestForm(companyId?: number) {
    this.logger.log(`Buscando o formulário mais recente${companyId ? ' para a empresa ' + companyId : ''}`);
    const form = await this.formBuilderRepository.getLatestForm(companyId);
    
    if (!form) {
      this.logger.warn('Nenhum formulário encontrado');
      return null;
    }
    
    return form;
  }
  
  async getFormById(id: number) {
    this.logger.log(`Buscando formulário pelo ID: ${id}`);
    const form = await this.formBuilderRepository.getFormById(id);
    
    if (!form) {
      throw new NotFoundException(`Formulário com ID ${id} não encontrado`);
    }
    
    return form;
  }
  
  async saveForm(formData: SaveFormDto) {
    this.logger.log(`Salvando formulário: ${formData.name}`);
    return this.formBuilderRepository.saveForm(formData);
  }
  
  async updateForm(id: number, formData: Partial<SaveFormDto>) {
    this.logger.log(`Atualizando formulário ID: ${id}`);
    return this.formBuilderRepository.updateForm(id, formData);
  }
  
  async getAllForms(companyId?: number) {
    this.logger.log('Buscando todos os formulários');
    return this.formBuilderRepository.getAllForms(companyId);
  }
  
  async deleteForm(id: number) {
    this.logger.log(`Excluindo formulário ID: ${id}`);
    return this.formBuilderRepository.deleteForm(id);
  }
  
  async setDefaultForm(id: number, companyId: number) {
    this.logger.log(`Definindo formulário ID: ${id} como padrão para empresa ID: ${companyId}`);
    await this.formBuilderRepository.clearDefaultForms(companyId);
    return this.formBuilderRepository.setAsDefault(id);
  }
}