import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class GeneralWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(GeneralWorksheetGenerator.name);

  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    const { users, scoreService } = props;
    
    this.logger.log('Iniciando criação da planilha GERAL');
    
    const worksheet = workbook.addWorksheet('GERAL', {
      properties: {
        tabColor: { argb: 'FFFF00' }
      }
    });
    
    const aspects = scoreService.getAspectsDefinition();
    
    this.logger.log('Calculando médias para todos os usuários');
    const allUserScores = await scoreService.calculateAverageGroupScores(users);
    
    this.logger.log('Calculando médias para gerentes');
    const managerScores = await scoreService.calculateAverageGroupScores(users, 
      user => user.funcaoMacro.includes('Gerente'));
      
    this.logger.log('Calculando médias para equipe');
    const teamScores = await scoreService.calculateAverageGroupScores(users, 
      user => user.funcaoMacro.includes('Equipe'));
    
    worksheet.columns = [
      { key: 'aspect', width: 20 }, 
      { key: 'element', width: 60 },
      { key: 'group', width: 15 },   
      { key: 'managers', width: 15 }, 
      { key: 'team', width: 15 }      
    ];
    
    const headerRow = worksheet.addRow(['GERAL', '', 'GRUPO', 'GERENTES', 'EQUIPE']);
    headerRow.eachCell((cell, colNumber) => {
      if (colNumber) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '0000FF' }
        };
        cell.font = {
          color: { argb: 'FFFFFF' },
          bold: true
        };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      }
    });
    
    let currentRow = 2;
    
    // Função para adicionar aspecto
    const addAspect = (aspect: string, elements: string[], color: string, textColor: string = '000000') => {
      // Calcular a linha inicial e final para mesclagem
      const startRow = currentRow;
      const endRow = currentRow + elements.length - 1;
      
      // Mesclar células na primeira coluna
      worksheet.mergeCells(`A${startRow}:A${endRow}`);
      
      // Configurar a célula mesclada
      const mergedCell = worksheet.getCell(`A${startRow}`);
      mergedCell.value = aspect;
      mergedCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      };
      mergedCell.font = {
        bold: true,
        color: { argb: textColor }
      };
      mergedCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };

      mergedCell.alignment = {
        horizontal: 'center',
        vertical: 'top'
      };
      
      for (let i = 0; i < elements.length; i++) {
        const row = worksheet.getRow(currentRow + i);
        const elementName = elements[i];
        
        row.getCell(2).value = elementName.toUpperCase();
        row.getCell(2).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        
        row.getCell(3).value = parseFloat(allUserScores[elementName] || '0');
        row.getCell(3).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        
        row.getCell(4).value = parseFloat(managerScores[elementName] || '0');
        row.getCell(4).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        
        row.getCell(5).value = parseFloat(teamScores[elementName] || '0');
        row.getCell(5).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      }
      
      currentRow += elements.length;
    };

    const addBlankRow = () => {
      const row = worksheet.getRow(currentRow);
      for (let i = 1; i <= 5; i++) {
        row.getCell(i).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      }
      currentRow++;
    };
    
    addAspect('FILOSOFIA', aspects.FILOSOFIA, 'FFFF00');
    addBlankRow();
    addAspect('ESTRATEGIA', aspects.ESTRATEGIA, 'FFA500');
    addBlankRow();
    addAspect('METODO', aspects.METODO, '008000', 'FFFFFF');
    
    for (let i = 2; i <= currentRow; i++) {
      for (let j = 3; j <= 5; j++) {
        const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
        if (typeof cell.value === 'number') {
          cell.numFmt = '0.0';
        }
      }
    }
    
    this.logger.log('Planilha GERAL criada com sucesso');
  }
}