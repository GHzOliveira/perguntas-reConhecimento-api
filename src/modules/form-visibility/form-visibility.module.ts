import { Module } from '@nestjs/common';
import { FormVisibilityService } from './form-visibility.service';
import { FormVisibilityController } from './form-visibility.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FormVisibilityService, PrismaService],
  controllers: [FormVisibilityController]
})
export class FormVisibilityModule {}
