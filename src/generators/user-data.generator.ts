import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class UserDataGenerator implements WorksheetGenerator {
  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    const { users } = props;
    const companyName = users.length > 0 && users[0].filial?.company?.name ? 
      users[0].filial.company.name : 'EMPRESA';
      
    const worksheet = workbook.addWorksheet(`DADOS ${companyName}`);
    
    worksheet.columns = [
      { header: 'NOME_FUNCIONARIO', key: 'nome', width: 30 },
      { header: 'NOME_FILIAL', key: 'filial', width: 25 },
      { header: 'CIDADE', key: 'cidade', width: 20 },
      { header: 'FUNCAO', key: 'funcaoMacro', width: 25 },
      { header: 'GENERO', key: 'genero', width: 20 },
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

    worksheet.autoFilter = {
      from: 'A1',
      to: 'E1',
    };
    
    for (const user of users) {
      worksheet.addRow({
        nome: user.nome,
        filial: user.filial?.filial?.toUpperCase() || 'N/A',
        cidade: user.cidade,
        funcaoMacro: user.funcaoMacro,
        genero: user.genero,
      });
    }
    
    worksheet.columns.forEach((column, index) => {
      if (index < worksheet.columns.length - 1) {
        const colLetter = String.fromCharCode(65 + index);
        const lastRow = worksheet.rowCount;
        
        for (let row = 1; row <= lastRow; row++) {
          const cell = worksheet.getCell(`${colLetter}${row}`);
          cell.border = {
            ...cell.border,
            right: { style: 'thin', color: { argb: 'CCCCCC' } }
          };
        }
      }
    });
  }
}