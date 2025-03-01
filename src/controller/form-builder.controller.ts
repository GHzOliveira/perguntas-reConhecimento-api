import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { FormBuilderService } from 'src/services/form-builder.service';

@Controller('/form-builder')
export class FormBuilderController {
  constructor(private readonly formBuilderService: FormBuilderService) {}
  
  @Get('/latest')
  async getLatestForm(@Query('companyId') companyId?: number) {
    return this.formBuilderService.getLatestForm(companyId);
  }
  
  @Post()
  async saveForm(@Body() formData: any) {
    return this.formBuilderService.saveForm(formData);
  }
  
  @Get()
  async getAllForms(@Query('companyId') companyId?: number) {
    return this.formBuilderService.getAllForms(companyId);
  }
}