import { Module } from '@nestjs/common';
import { FilialController } from '../controller/filial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilialRepository } from 'src/repositories/filial.repositorie';
import { FilialService } from 'src/services/filial.service';
import { LinkService } from 'src/services/link.service';
import { CompanyService } from 'src/services/company.service';
import { CompanyRepository } from 'src/repositories/company.repositorie';

@Module({
  controllers: [FilialController],
  providers: [FilialService, FilialRepository, PrismaService, LinkService, CompanyService, CompanyRepository],
  exports: [FilialService],
})
export class FilialModule {}
