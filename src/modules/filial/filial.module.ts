import { Module } from '@nestjs/common';
import { FilialService } from './services/filial.service';
import { FilialController } from './filial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilialRepository } from 'src/repositories/filial.repositorie';
import { LinkService } from './services/link.service';

@Module({
  controllers: [FilialController],
  providers: [FilialService, FilialRepository, PrismaService, LinkService],
  exports: [FilialService],
})
export class FilialModule {}
