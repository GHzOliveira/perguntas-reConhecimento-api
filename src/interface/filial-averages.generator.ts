import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import {
  WorksheetGenerator,
  WorksheetGeneratorProps,
} from 'src/interface/worksheet-generator.interface';

@Injectable()
export class FilialAveragesWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(FilialAveragesWorksheetGenerator.name);
  
  async generate(
    workbook: ExcelJS.Workbook,
    props: WorksheetGeneratorProps,
  ): Promise<void> {
    const { scoreService, users } = props;
    const aspectsDefinition = scoreService.getAspectsDefinition();

    this.logger.log('Iniciando geração da planilha de médias gerais por filial');
    
    const averageScores = await scoreService.calculateAverageGroupScores(users);
    
    const worksheet = workbook.addWorksheet('MEDIAS GERAIS POR FILIAL', {
      properties: {
        tabColor: { argb: '0070C0' },
      },
    });

    // Título principal
    const titleRow = worksheet.getRow(1);
    const titleCell = titleRow.getCell(1);
    titleCell.value = 'MÉDIA GERAL DO GRUPO';
    titleCell.font = {
      size: 16,
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '000000' }
    };

    worksheet.mergeCells('A1:G1');

    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    titleRow.height = 30;

    // Linha em branco
    worksheet.getRow(2).height = 10;

    let currentRow = 3;

    // Adicionar FILOSOFIA na coluna A
    const filosofiaStartCol = 'A';
    this.addSectionTable(
      worksheet, 
      currentRow, 
      filosofiaStartCol,
      'FILOSOFIA', 
      'FFA500', // Laranja
      aspectsDefinition.FILOSOFIA,
      averageScores
    );

    // Adicionar ESTRATEGIA abaixo de FILOSOFIA na coluna A
    const estrategiaStartRow = currentRow + aspectsDefinition.FILOSOFIA.length + 4; // +4 para título e espaço
    const estrategiaStartCol = 'A';
    this.addSectionTable(
      worksheet, 
      estrategiaStartRow, 
      estrategiaStartCol,
      'ESTRATEGIA', 
      '008000', // Verde
      aspectsDefinition.ESTRATEGIA,
      averageScores
    );

    // Adicionar METODO na coluna D (à direita)
    const metodoStartCol = 'D';
    this.addSectionTable(
      worksheet, 
      currentRow, 
      metodoStartCol,
      'METODO', 
      '0000FF', // Azul
      aspectsDefinition.METODO,
      averageScores,
      true // Texto branco para o título
    );

    // Ajustar largura das colunas
    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 15;
    worksheet.getColumn('D').width = 40;
    worksheet.getColumn('E').width = 15;
    
    this.logger.log('Planilha de médias gerais por filial gerada com sucesso');
  }

  private addSectionTable(
    worksheet: ExcelJS.Worksheet, 
    startRow: number, 
    startCol: string,
    sectionTitle: string, 
    titleColor: string, 
    elements: string[],
    averageScores: Record<string, string>,
    whiteTitle: boolean = false
  ): void {
    let currentRow = startRow;
    const valueCol = String.fromCharCode(startCol.charCodeAt(0) + 1);
    
    // Mesclar células para título da seção
    worksheet.mergeCells(`${startCol}${currentRow}:${startCol}${currentRow + 1}`);

    const titleCell = worksheet.getCell(`${startCol}${currentRow}`);
    titleCell.value = sectionTitle;
    titleCell.font = {
      bold: true,
      color: { argb: whiteTitle ? 'FFFFFF' : '000000' }
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: titleColor }
    };
    titleCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
    titleCell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    
    const mediasTotaisCell = worksheet.getCell(`${valueCol}${currentRow}`);
    mediasTotaisCell.value = 'MÉDIAS TOTAIS';
    mediasTotaisCell.font = {
      bold: true
    };
    mediasTotaisCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
    mediasTotaisCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    
    // Calcular a média total dos elementos desta seção
    let sectionTotal = 0;
    let validElementsCount = 0;
    
    for (const element of elements) {
      if (averageScores[element]) {
        sectionTotal += parseFloat(averageScores[element]);
        validElementsCount++;
      }
    }
    
    const sectionAverage = validElementsCount > 0 
      ? (sectionTotal / validElementsCount).toFixed(1) 
      : "0.0";
    
    const totalAverageCell = worksheet.getCell(`${valueCol}${currentRow + 1}`);
    totalAverageCell.value = sectionAverage;
    totalAverageCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
    totalAverageCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    
    currentRow += 2;
    
    // Adicionar elementos da seção
    for (const element of elements) {
      const elementCell = worksheet.getCell(`${startCol}${currentRow}`);
      elementCell.value = element.toUpperCase();
      elementCell.font = {
        bold: true
      };
      elementCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' }
      };
      elementCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      
      const valueCell = worksheet.getCell(`${valueCol}${currentRow}`);
      const elementScore = averageScores[element] || "0.0";
      valueCell.value = elementScore;
      valueCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      valueCell.alignment = {
        horizontal: 'center'
      };
      
      currentRow++;
    }
  }
}