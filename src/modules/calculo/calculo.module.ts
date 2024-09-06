import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CalculoController } from './conculo.controller';
import { CalculoService } from './calculo.service';

@Module({
  controllers: [CalculoController],
  providers: [PrismaService, CalculoService]
})
export class CalculoModule {}
