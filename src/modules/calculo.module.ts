import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CalculoService } from '../services/calculo.service';
import { CalculoController } from 'src/controller/calculo.controller';

@Module({
  controllers: [CalculoController],
  providers: [PrismaService, CalculoService]
})
export class CalculoModule {}
