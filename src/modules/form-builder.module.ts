import { Module } from '@nestjs/common';
import { FormBuilderController } from '../controller/form-builder.controller';
import { FormBuilderService } from '../services/form-builder.service';
import { FormBuilderRepository } from '../repositories/form-builder.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FormBuilderController],
  providers: [
    FormBuilderService,
    FormBuilderRepository,
    PrismaService,
  ],
  exports: [FormBuilderService],
})
export class FormBuilderModule {}