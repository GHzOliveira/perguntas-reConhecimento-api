import { Injectable, Logger } from '@nestjs/common';
import { FormBuilderRepository } from '../repositories/form-builder.repository';
import { FormVisibilityField } from '../interface/form-builder.interface';

@Injectable()
export class FormBuilderService {
  private readonly logger = new Logger(FormBuilderService.name);

  constructor(private readonly formBuilderRepository: FormBuilderRepository) {}
  
  // Implemente os métodos necessários aqui
  async getLatestForm() {
    this.logger.log('Buscando o formulário mais recente');
    return this.formBuilderRepository.getLatestForm();
  }
  
  async saveForm(formData: any) {
    this.logger.log('Salvando formulário');
    return this.formBuilderRepository.saveForm(formData);
  }
  
  async getAllForms() {
    this.logger.log('Buscando todos os formulários');
    return this.formBuilderRepository.getAllForms();
  }
}