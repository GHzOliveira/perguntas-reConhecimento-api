import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FormVisibilityService } from './form-visibility.service';

interface UpdateFormVisibilityDto {
  companyId: number;
  field: string;
  isVisible: boolean;
}

@Controller('form-visibility')
export class FormVisibilityController {
  constructor(private readonly formVisibilityService: FormVisibilityService) {}

  @Get(':companyId')
  async getVisibility(@Param('companyId') companyId: number) {
    return this.formVisibilityService.getFormVisibility(Number(companyId));
  }

  @Post(':companyId')
  async setVisibility(
    @Param('companyId') companyId: number,
    @Body() fields: { field: string; isVisible: boolean }[],
  ) {
    return this.formVisibilityService.setFormVisibility(
      Number(companyId),
      fields,
    );
  }

  @Patch()
  updateVisibility(@Body() updateDto: UpdateFormVisibilityDto) {
    const { companyId, field, isVisible } = updateDto;
    return this.formVisibilityService.updateVisibility(
      companyId,
      field,
      isVisible,
    );
  }
}