import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScoreService } from 'src/services/calculo/score.service';
import { ExcelModule } from './excel.module';
import { CalculoService } from 'src/services/calculo/calculo.service';
import { CalculoController } from 'src/controller/calculo.controller';

@Module({
  imports: [PrismaModule, ExcelModule],
  providers: [CalculoService, ScoreService],
  exports: [CalculoService, ScoreService],
  controllers: [CalculoController],
})
export class CalculoModule {}