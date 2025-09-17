import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScoreService } from './score.service';
import * as ExcelJS from 'exceljs';
import { ExcelReportService } from '../excel/excel-report.service';

@Injectable()
export class CalculoService {
  private readonly logger = new Logger(CalculoService.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoreService: ScoreService,
    private readonly excelReportService: ExcelReportService,
  ) {}

  private getDynamicField(
    user: any,
    fieldName: string,
    defaultValue: any = '',
  ): any {
    if (user[fieldName] !== undefined) {
      return user[fieldName];
    }

    if (
      user.dynamicResponses &&
      user.dynamicResponses[fieldName] !== undefined
    ) {
      return user.dynamicResponses[fieldName];
    }
    return defaultValue;
  }

  async getQuestionText(questionId: number): Promise<string> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id: questionId },
      });
      
      if (!question) {
        this.logger.warn(`Pergunta não encontrada para ID: ${questionId}`);
        return 'Pergunta não encontrada';
      }
      
      return question.text;
    } catch (error) {
      this.logger.error(`Erro ao buscar pergunta ${questionId}: ${error.message}`);
      throw new Error(`Falha ao buscar texto da pergunta: ${error.message}`);
    }
  }

  async generateExcelUserIndividualScores(userId: number, res: Response) {
    const scores = await this.scoreService.calculateGroupScores(userId);
    const aspects = this.scoreService.getAspectsDefinition();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scores');

    worksheet.columns = [
      { header: 'ASPECTO', key: 'aspect', width: 20 },
      { header: 'ELEMENTO', key: 'groupName', width: 50 },
      {
        header: 'RESULTADO EM %',
        key: 'score',
        width: 20,
        style: { alignment: { horizontal: 'center' } },
      },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
    });

    for (const [aspect, groupNames] of Object.entries(aspects)) {
      const aspectScores = groupNames.map((groupName) =>
        parseFloat(scores[groupName]),
      );
      const aspectAverage = (
        aspectScores.reduce((sum, score) => sum + score, 0) /
        aspectScores.length
      ).toFixed(1);

      const row = worksheet.addRow({
        aspect,
        groupName: '',
        score: aspectAverage,
      });

      let fillColor;
      if (aspect === 'FILOSOFIA') {
        fillColor = 'FFFF00'; // Amarelo
      } else if (aspect === 'ESTRATEGIA') {
        fillColor = 'FFA500'; // Laranja
      } else if (aspect === 'METODO') {
        fillColor = '008000'; // Verde
      }

      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor },
        };
      });

      for (const groupName of groupNames) {
        worksheet.addRow({ aspect, groupName, score: scores[groupName] });
      }
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'ResultadoIndividual.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async calculateAndGenerateExcel(userId: number, res: Response) {
    await this.generateExcelUserIndividualScores(userId, res);
  }

  async generateExcelWithUserResults(companyId: number, res: Response): Promise<void> {
    return this.excelReportService.generateExcelWithUserResults(companyId, res);
  }
}