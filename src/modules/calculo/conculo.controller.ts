import { Controller, Get, Param, Res } from '@nestjs/common';
import { CalculoService } from './calculo.service';
import { Response } from 'express';

@Controller('calculo')
export class CalculoController {
  constructor(private readonly calculoService: CalculoService) {}

  @Get('group-score/:userId')
  async getgroupScore(@Param('userId') userId: string) {
    const result = await this.calculoService.calculateGroupScores(
      Number(userId),
    );
    return result;
  }

  @Get('group-score-excel/:userId')
  async getGroupScoreExcel(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    await this.calculoService.generateExcelUserIndividualScores(
      Number(userId),
      res,
    );
  }

  @Get('calculate-and-generate-excel/:userId')
  async calculateAndGenerateExcel(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    await this.calculoService.calculateAndGenerateExcel(Number(userId), res);
  }

  @Get('generate-excel')
  async generateExcelWithUserResults(@Res() res: Response) {
    await this.calculoService.generateExcelWithUserResults(res);
  }
}
