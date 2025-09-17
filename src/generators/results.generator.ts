import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class ResultsWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(ResultsWorksheetGenerator.name);

  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    try {
      this.logger.log('Iniciando geração da planilha de resultados');
      const { users, scoreService } = props;
      
      if (!users || users.length === 0) {
        this.logger.warn('Nenhum usuário encontrado para gerar a planilha de resultados');
        return;
      }
      
      if (!scoreService) {
        throw new Error('O serviço de pontuação (scoreService) é necessário para gerar a planilha de resultados');
      }

      const worksheet = workbook.addWorksheet('Resultados', {
        properties: {
          tabColor: { argb: '0070C0' }
        }
      });

      const groupNames = scoreService.getGroupNames();
      
      worksheet.columns = [
        { header: 'NOME', key: 'nome', width: 30 },
        ...groupNames.map((groupName) => ({
          header: groupName.toUpperCase(),
          key: groupName,
          width: 20,
        })),
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '000000' },
        };
        cell.font = {
          color: { argb: 'FFFFFF' },
          bold: true,
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      worksheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + groupNames.length)}1`,
      };

      let processedCount = 0;
      for (const user of users) {
        try {
          const scores = await scoreService.calculateGroupScores(user.id);
          const row = { nome: user.nome, ...scores };
          const excelRow = worksheet.addRow(row);
          
          for (let i = 2; i <= groupNames.length + 1; i++) {
            const cell = excelRow.getCell(i);
            cell.numFmt = '0.0';
            cell.alignment = { horizontal: 'center' };
          }
          
          processedCount++;
        } catch (error) {
          this.logger.error(`Erro ao processar resultados do usuário ${user.nome}: ${error.message}`);
        }
      }

      for (let i = 1; i <= worksheet.rowCount; i++) {
        for (let j = 1; j <= worksheet.columnCount; j++) {
          const cell = worksheet.getCell(i, j);
          cell.border = {
            top: { style: 'thin', color: { argb: 'CCCCCC' } },
            left: { style: 'thin', color: { argb: 'CCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
            right: { style: 'thin', color: { argb: 'CCCCCC' } }
          };
        }
      }

      worksheet.views = [
        { state: 'frozen', xSplit: 1, ySplit: 1 }
      ];

      this.logger.log(`Planilha de resultados gerada com sucesso para ${processedCount} usuários`);
    } catch (error) {
      this.logger.error(`Erro ao gerar planilha de resultados: ${error.message}`);
      throw new Error(`Falha na geração da planilha de resultados: ${error.message}`);
    }
  }
}