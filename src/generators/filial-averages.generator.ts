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
    const { scoreService, users, filiais } = props;
    const aspectsDefinition = scoreService.getAspectsDefinition();

    this.logger.log('Iniciando geração da planilha de médias gerais por filial');
    
    const filialAverages = {};
    const elementTotalsByFilial = {};

    const sections = ['FILOSOFIA', 'ESTRATEGIA', 'METODO'];
    
    for (const section of sections) {
      elementTotalsByFilial[section] = {};
      const sectionElements = aspectsDefinition[section];
      
      for (const element of sectionElements) {
        elementTotalsByFilial[section][element] = 0;
      }
    }
    
    // Calcular médias por filial
    let activeFiliaisCount = 0;
    
    for (const filial of filiais) {
      const filialUsers = users.filter(user => user.filialId === filial.id);
      
      if (filialUsers.length === 0) continue;
      
      activeFiliaisCount++;
      
      // Calcular médias para esta filial
      const filialScores = await scoreService.calculateAverageGroupScores(filialUsers);
      filialAverages[filial.id] = filialScores;
      
      // Acumular totais por elemento para cada seção
      for (const section of sections) {
        const sectionElements = aspectsDefinition[section];
        
        for (const element of sectionElements) {
          if (filialScores[element]) {
            elementTotalsByFilial[section][element] += parseFloat(filialScores[element]);
          }
        }
      }
    }
    
    // Calcular médias das filiais para cada elemento
    const averagesBySection: Record<string, Record<string, string>> = {};
    
    for (const section of sections) {
      averagesBySection[section] = {};
      const sectionElements = aspectsDefinition[section];
      
      for (const element of sectionElements) {
        averagesBySection[section][element] = activeFiliaisCount > 0
          ? (elementTotalsByFilial[section][element] / activeFiliaisCount).toFixed(1)
          : "0.0";
      }
    }
    
    const worksheet = workbook.addWorksheet('MEDIAS GERAIS POR FILIAL', {
      properties: {
        tabColor: { argb: '0070C0' },
      },
    });

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

    worksheet.mergeCells('A1:Z1');

    titleCell.alignment = {
      horizontal: 'left',
      vertical: 'middle'
    };

    titleRow.height = 30;

    worksheet.getRow(2).height = 10;

    let currentRow = 3;

    const filosofiaStartCol = 'A';
    this.addSectionTable(
      worksheet, 
      currentRow, 
      filosofiaStartCol,
      'FILOSOFIA', 
      'FFFF00',
      aspectsDefinition.FILOSOFIA,
      averagesBySection.FILOSOFIA  // Usar as médias por filial aqui
    );

    const estrategiaStartRow = currentRow + aspectsDefinition.FILOSOFIA.length + 4;
    const estrategiaStartCol = 'A';
    this.addSectionTable(
      worksheet, 
      estrategiaStartRow, 
      estrategiaStartCol,
      'ESTRATEGIA', 
      'FFA500',
      aspectsDefinition.ESTRATEGIA,
      averagesBySection.ESTRATEGIA  // Usar as médias por filial aqui
    );

    const metodoStartCol = 'D';
    this.addSectionTable(
      worksheet, 
      currentRow, 
      metodoStartCol,
      'METODO', 
      '008000',
      aspectsDefinition.METODO,
      averagesBySection.METODO,  // Usar as médias por filial aqui
      true 
    );

    const lastRowFilosofia = currentRow + aspectsDefinition.FILOSOFIA.length + 2;
    const lastRowEstrategia = estrategiaStartRow + aspectsDefinition.ESTRATEGIA.length + 2;
    const lastRow = Math.max(lastRowFilosofia, lastRowEstrategia);

    const mediaFilialStartRow = lastRow + 3;

    const mediaPorFilialRow = worksheet.getRow(mediaFilialStartRow);
    const mediaPorFilialCell = mediaPorFilialRow.getCell(1);
    mediaPorFilialCell.value = 'MEDIA POR FILIAL';
    mediaPorFilialCell.font = {
      size: 16,
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    mediaPorFilialCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '000000' }
    };
  
    worksheet.mergeCells(`A${mediaFilialStartRow}:Z${mediaFilialStartRow}`);
  
    mediaPorFilialCell.alignment = {
      horizontal: 'left',
      vertical: 'middle'
    };
  
    mediaPorFilialRow.height = 30;

    worksheet.getRow(mediaFilialStartRow + 1).height = 10;

    let tableStartRow = mediaFilialStartRow + 2;

    tableStartRow = await this.addFilialAveragesTable(
      worksheet, 
      tableStartRow, 
      filiais, 
      users, 
      scoreService, 
      aspectsDefinition,
      'FILOSOFIA'
    );

    worksheet.getRow(tableStartRow).height = 20;
    tableStartRow += 1;

    tableStartRow = await this.addFilialAveragesTable(
      worksheet, 
      tableStartRow, 
      filiais, 
      users, 
      scoreService, 
      aspectsDefinition,
      'ESTRATEGIA'
    );

    worksheet.getRow(tableStartRow).height = 20;
    tableStartRow += 1;

    tableStartRow = await this.addFilialAveragesTable(
      worksheet, 
      tableStartRow, 
      filiais, 
      users, 
      scoreService, 
      aspectsDefinition,
      'METODO'
    );

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 15;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 40;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 15;
    
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

  private async addFilialAveragesTable(
    worksheet: ExcelJS.Worksheet,
    startRow: number,
    filiais: any[],
    users: any[],
    scoreService: any,
    aspectsDefinition: any,
    sectionType: 'FILOSOFIA' | 'ESTRATEGIA' | 'METODO' = 'FILOSOFIA'
  ): Promise<number> {
    let currentRow = startRow;

    const sectionTitleRow = worksheet.getRow(currentRow);
    const sectionTitleCell = sectionTitleRow.getCell(1);
    sectionTitleCell.value = `MÉDIA DE ${sectionType}`;
    sectionTitleCell.font = {
      size: 14,
      bold: true,
      color: { argb: '000000' }
    };

    const sectionColors = {
      'FILOSOFIA': 'FFFF00',  // Amarelo
      'ESTRATEGIA': 'FFA500', // Laranja
      'METODO': '90EE90'      // Verde claro
    };
    
    sectionTitleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: sectionColors[sectionType] }
    };
    
    worksheet.mergeCells(`A${currentRow}:Z${currentRow}`);
    sectionTitleCell.alignment = {
      horizontal: 'left',
      vertical: 'middle'
    };
    sectionTitleRow.height = 25;
    
    currentRow += 1;
    
    const sectionElements = aspectsDefinition[sectionType];
    
    const headerRow = worksheet.getRow(currentRow);
    
    const headerCell = headerRow.getCell(1);
    headerCell.value = 'Rótulos de Linha';
    headerCell.font = { bold: true };
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };
    headerCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Segunda coluna - Média de seção
    const mediaSectionCell = headerRow.getCell(2);
    mediaSectionCell.value = `Média de ${sectionType}`;
    mediaSectionCell.font = { bold: true };
    mediaSectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };
    mediaSectionCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Colunas dos elementos de seção
    for (let i = 0; i < sectionElements.length; i++) {
      const elementCell = headerRow.getCell(i + 3);
      elementCell.value = sectionElements[i].toUpperCase();
      elementCell.font = { bold: true };
      elementCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      };
      elementCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      elementCell.alignment = { horizontal: 'center' };
    }
    
    // Adicionar filtro ao cabeçalho
    worksheet.autoFilter = {
      from: { row: currentRow, column: 1 },
      to: { row: currentRow, column: sectionElements.length + 2 }
    };
    
    currentRow++;
    
    // Calcular médias por filial
    const filialAverages = {};
    let totalSectionAverage = 0;
    let totalElementAverages = sectionElements.reduce((acc, element) => {
      acc[element] = 0;
      return acc;
    }, {});
    
    for (const filial of filiais) {
      const filialUsers = users.filter(user => user.filialId === filial.id);
      
      if (filialUsers.length === 0) continue;
      
      // Calcular média dos elementos da seção para esta filial
      const filialScores = await scoreService.calculateAverageGroupScores(filialUsers);
      
      // Calcular média geral da seção para esta filial
      let sectionTotal = 0;
      let validElementsCount = 0;
      
      for (const element of sectionElements) {
        if (filialScores[element]) {
          sectionTotal += parseFloat(filialScores[element]);
          validElementsCount++;
          
          // Acumular para o total geral
          totalElementAverages[element] += parseFloat(filialScores[element]);
        }
      }
      
      const sectionAverage = validElementsCount > 0 
        ? (sectionTotal / validElementsCount).toFixed(1) 
        : "0.0";
      
      filialAverages[filial.id] = {
        name: filial.filial,
        sectionAverage,
        elements: filialScores
      };
      
      totalSectionAverage += parseFloat(sectionAverage);
      
      // Adicionar linha para esta filial
      const filialRow = worksheet.getRow(currentRow);
      
      // Nome da filial
      const filialNameCell = filialRow.getCell(1);
      filialNameCell.value = filial.filial;
      filialNameCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Média da seção
      const filialMediaCell = filialRow.getCell(2);
      filialMediaCell.value = sectionAverage;
      filialMediaCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      filialMediaCell.alignment = { horizontal: 'center' };
      
      // Médias dos elementos
      for (let i = 0; i < sectionElements.length; i++) {
        const elementValue = filialScores[sectionElements[i]] || "0.0";
        const elementCell = filialRow.getCell(i + 3);
        elementCell.value = elementValue;
        elementCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        elementCell.alignment = { horizontal: 'center' };
      }
      
      currentRow++;
    }
    
    // Adicionar linha de total geral
    const totalRow = worksheet.getRow(currentRow);
    
    // Total Geral (primeira coluna)
    const totalLabelCell = totalRow.getCell(1);
    totalLabelCell.value = 'Total Geral';
    totalLabelCell.font = { bold: true };
    totalLabelCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };
    totalLabelCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Média total da seção
    const totalSectionCell = totalRow.getCell(2);
    const filiaisCount = Object.keys(filialAverages).length;
    const totalSectionValue = filiaisCount > 0 
      ? (totalSectionAverage / filiaisCount).toFixed(1) 
      : "0.0";
    
      totalSectionCell.value = totalSectionValue;
      totalSectionCell.font = { bold: true };
      totalSectionCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      };
      totalSectionCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      totalSectionCell.alignment = { horizontal: 'center' };
    
    // Médias totais dos elementos
    for (let i = 0; i < sectionElements.length; i++) {
      const element = sectionElements[i];
      const elementTotalValue = filiaisCount > 0 
        ? (totalElementAverages[element] / filiaisCount).toFixed(1) 
        : "0.0";
      
      const elementTotalCell = totalRow.getCell(i + 3);
      elementTotalCell.value = elementTotalValue;
      elementTotalCell.font = { bold: true };
      elementTotalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      };
      elementTotalCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      elementTotalCell.alignment = { horizontal: 'center' };
    }
    
    if (sectionElements.length > 3) {
      worksheet.getColumn(1).width = 25;
      worksheet.getColumn(2).width = 20;
      for (let i = 0; i < sectionElements.length; i++) {
        worksheet.getColumn(i + 3).width = 20;
      }
    }

    currentRow++;
    return currentRow;
  }
  
}