import { Module } from '@nestjs/common';
import { CompanyController } from 'src/controller/company.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRepository } from 'src/repositories/company.repositorie';
import { CompanyService } from 'src/services/company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, PrismaService],
  exports: [CompanyService],
})
export class CompanyModule {}