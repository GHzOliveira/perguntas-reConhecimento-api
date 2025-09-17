import { Module } from '@nestjs/common';
import { AdditionalInfoGenerator } from 'src/generators/additional-info.generator';
import { FilialWorksheetGenerator } from 'src/generators/filial.generator';
import { GeneralWorksheetGenerator } from 'src/generators/general.generator';
import { ResponsesWorksheetGenerator } from 'src/generators/responses.generator';
import { ResultsWorksheetGenerator } from 'src/generators/results.generator';
import { UserDataGenerator } from 'src/generators/user-data.generator';
import { FilialAveragesWorksheetGenerator } from 'src/generators/filial-averages.generator';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScoreService } from 'src/services/calculo/score.service';
import { ExcelBaseService } from 'src/services/excel/excel-base.service';
import { ExcelReportService } from 'src/services/excel/excel-report.service';
import { FuncaoAveragesWorksheetGenerator } from 'src/generators/funcao-averages.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    ExcelBaseService,
    ExcelReportService,
    UserDataGenerator,
    GeneralWorksheetGenerator,
    ResultsWorksheetGenerator,
    AdditionalInfoGenerator,
    ResponsesWorksheetGenerator,
    FilialWorksheetGenerator,
    FilialAveragesWorksheetGenerator,
    FuncaoAveragesWorksheetGenerator,
    ScoreService,
  ],
  exports: [ExcelReportService, ExcelBaseService],
})
export class ExcelModule {}