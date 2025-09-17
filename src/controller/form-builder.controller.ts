import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { SaveFormDto } from 'src/dto/dto-form/form-build.dto';
import { FormBuilderService } from 'src/services/form-builder.service';

@Controller('/form-builder')
export class FormBuilderController {
  constructor(private readonly formBuilderService: FormBuilderService) { }

  @Get('/latest')
  async getLatestForm(@Query('companyId') companyId?: number) {
    return this.formBuilderService.getLatestForm(companyId);
  }

  @Get('/:id')
  async getFormById(@Param('id', ParseIntPipe) id: number) {
    return this.formBuilderService.getFormById(id);
  }

   /**
   * Retorna todos formulários associados a uma empresa específica com resposta padronizada
   * @param companyId ID da empresa
   */
   @Get('/company/:companyId')
   async getFormsByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
     return this.formBuilderService.getFormsByCompanyId(companyId);
   }

  @Get()
  async getAllForms(@Param('companyId') companyId: number) {
    return this.formBuilderService.getAllForms(companyId);
  }

  @Post()
  async saveForm(@Body() formData: SaveFormDto) {
    return this.formBuilderService.saveForm(formData);
  }

  @Put('/:id')
  async updateForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() formData: Partial<SaveFormDto>
  ) {
    return this.formBuilderService.updateForm(id, formData);
  }


  @Delete('/:id')
  async deleteForm(@Param('id', ParseIntPipe) id: number) {
    return this.formBuilderService.deleteForm(id);
  }

  @Patch('/:id/set-default')
  async setDefaultForm(
    @Param('id', ParseIntPipe) id: number,
    @Body('companyId', ParseIntPipe) companyId: number
  ) {
    return this.formBuilderService.setDefaultForm(id, companyId);
  }
}