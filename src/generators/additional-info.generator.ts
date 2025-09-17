import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class AdditionalInfoGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(AdditionalInfoGenerator.name);

  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    this.logger.log('Gerando planilha de informações adicionais');
    
    const { users } = props;
    const additionalInfoSheet = workbook.addWorksheet('inf.adicionais');
    const dynamicKeys = this.extractDynamicKeysFromUsers(users);

    const columns: Partial<ExcelJS.Column>[] = [
      { header: 'NOME', key: 'nome', width: 30 },
      { header: 'FILIAL', key: 'filial', width: 20 },
    ];

    Array.from(dynamicKeys)
      .sort()
      .forEach((key) => {
        columns.push({
          header: key.toUpperCase(),
          key: key,
          width: 20,
        });
      });

    additionalInfoSheet.columns = columns as ExcelJS.Column[];

    additionalInfoSheet.getRow(1).eachCell((cell) => {
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

    if (columns.length > 0) {
      additionalInfoSheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + columns.length - 1)}1`,
      };
    }

    for (const user of users) {
      const row: any = {
        nome: user.nome,
        filial: user.filial?.filial || 'N/A',
      };

      if (user.dynamicResponses) {
        Object.entries(user.dynamicResponses).forEach(([key, value]) => {
          row[key] = value;
        });
      }

      additionalInfoSheet.addRow(row);
    }
    
    this.logger.log(`Planilha de informações adicionais criada com ${users.length} linhas`);
  }

  /**
   * Extrai todas as chaves dinâmicas presentes nos dados dos usuários
   */
  private extractDynamicKeysFromUsers(users: any[]): Set<string> {
    const dynamicKeys = new Set<string>();
    
    users.forEach((user) => {
      if (user.dynamicResponses) {
        Object.keys(user.dynamicResponses).forEach((key) => {
          dynamicKeys.add(key);
        });
      }
    });
    
    return dynamicKeys;
  }
}