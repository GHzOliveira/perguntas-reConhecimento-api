import { Body, Controller, Get, Patch } from '@nestjs/common';
import { FormVisibilityService } from './form-visibility.service';

@Controller('form-visibility')
export class FormVisibilityController {
    constructor(private readonly formVisibilityService: FormVisibilityService) {}

    @Get()
    getVisibility() {
      return this.formVisibilityService.getVisibility();
    }
  
    @Patch()
    updateVisibility(@Body() updateDto: { field: string; isVisible: boolean }) {
      return this.formVisibilityService.updateVisibility(updateDto.field, updateDto.isVisible);
    }
}
