import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelBaseService {
  private readonly logger = new Logger(ExcelBaseService.name);

  async configureExcelDownload(res: Response, filename: string, workbook: ExcelJS.Workbook): Promise<void> {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );
    
    try {
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      this.logger.error(`Erro ao escrever Excel: ${error.message}`);
      throw new Error(`Falha ao gerar arquivo Excel: ${error.message}`);
    }
  }
  
  formatHeaderRow(row: ExcelJS.Row): void {
    row.eachCell((cell) => {
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
  }
}