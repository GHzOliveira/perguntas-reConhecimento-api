import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import {
  WorksheetGenerator,
  WorksheetGeneratorProps,
} from 'src/interface/worksheet-generator.interface';

@Injectable()
export class FuncaoAveragesWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(FuncaoAveragesWorksheetGenerator.name);

  async generate(
    workbook: ExcelJS.Workbook,
    props: WorksheetGeneratorProps,
  ): Promise<void> {
    const { scoreService, users, filiais } = props;
    const aspectsDefinition = scoreService.getAspectsDefinition();

    this.logger.log('Iniciando geração da planilha de médias por função');

    // Obter todas as funções/cargos dos usuários
    const funcoes = [
      ...new Set(users.map((user) => user.funcaoMacro).filter(Boolean)),
    ];

    if (funcoes.length === 0) {
      this.logger.warn(
        'Nenhuma função encontrada para os usuários. A planilha será gerada vazia.',
      );
      return;
    }

    const worksheet = workbook.addWorksheet('MEDIA POR FUNÇÃO', {
      properties: {
        tabColor: { argb: '9370DB' },
      },
    });

    const sections: Array<'FILOSOFIA' | 'ESTRATEGIA' | 'METODO'> = [
      'FILOSOFIA',
      'ESTRATEGIA',
      'METODO',
    ];
    let tableStartRow = 1;

    for (const sectionType of sections) {
      tableStartRow = await this.addFuncaoAveragesTable(
        worksheet,
        tableStartRow,
        funcoes,
        users,
        scoreService,
        aspectsDefinition,
        sectionType,
        filiais || [],
      );

      worksheet.getRow(tableStartRow).height = 20;
      tableStartRow += 1;
    }

    // Definir larguras das colunas
    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 15;

    this.logger.log('Planilha de médias por função gerada com sucesso');
  }

  private async addFuncaoAveragesTable(
    worksheet: ExcelJS.Worksheet,
    startRow: number,
    funcoes: string[],
    users: any[],
    scoreService: any,
    aspectsDefinition: any,
    sectionType: 'FILOSOFIA' | 'ESTRATEGIA' | 'METODO',
    filiais: any[],
  ): Promise<number> {
    let currentRow = startRow;

    const sectionElements = aspectsDefinition[sectionType];

    const sectionColors = {
      FILOSOFIA: 'FFFF00', // Amarelo
      ESTRATEGIA: 'FFA500', // Laranja
      METODO: '008000', // Verde
    };

    const headerColor = sectionColors[sectionType];

    const headerRow = worksheet.getRow(currentRow);

    // Configuração do cabeçalho (sem alterações)
    // ...configuração atual do cabeçalho...
    const headerCell = headerRow.getCell(1);
    headerCell.value = 'Rótulos de Linha';
    headerCell.font = {
      bold: true,
      color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' }, 
    };
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor },
    };
    headerCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Segunda coluna - Média de seção
    const mediaSectionCell = headerRow.getCell(2);
    mediaSectionCell.value = `Média de ${sectionType}`;
    mediaSectionCell.font = {
      bold: true,
      color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' },
    };
    mediaSectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor },
    };
    mediaSectionCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Colunas dos elementos de seção
    for (let i = 0; i < sectionElements.length; i++) {
      const elementCell = headerRow.getCell(i + 3);
      elementCell.value = sectionElements[i].toUpperCase();
      elementCell.font = {
        bold: true,
        color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' },
      };
      elementCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColor },
      };
      elementCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      elementCell.alignment = { horizontal: 'center' };
    }

    // Adicionar filtro ao cabeçalho
    worksheet.autoFilter = {
      from: { row: currentRow, column: 1 },
      to: { row: currentRow, column: sectionElements.length + 2 },
    };

    currentRow++;

    // Calcular médias por função
    const funcaoAverages = {};
    let totalSectionAverage = 0;
    let totalElementAverages = sectionElements.reduce((acc, element) => {
      acc[element] = 0;
      return acc;
    }, {});

    // Contador de funções que realmente têm dados
    let activeFuncoesCount = 0;

    for (const funcaoMacro of funcoes) {
      const funcaoUsers = users.filter(
        (user) => user.funcaoMacro === funcaoMacro,
      );

      if (funcaoUsers.length === 0) continue;

      activeFuncoesCount++;

      // Calcular média dos elementos da seção para esta função
      const funcaoScores =
        await scoreService.calculateAverageGroupScores(funcaoUsers);

      // Calcular média geral da seção para esta função
      let sectionTotal = 0;
      let validElementsCount = 0;

      for (const element of sectionElements) {
        if (funcaoScores[element]) {
          sectionTotal += parseFloat(funcaoScores[element]);
          validElementsCount++;

          // Acumular para o total geral
          totalElementAverages[element] += parseFloat(funcaoScores[element]);
        }
      }

      const sectionAverage =
        validElementsCount > 0
          ? (sectionTotal / validElementsCount).toFixed(1)
          : '0.0';

      funcaoAverages[funcaoMacro] = {
        name: funcaoMacro,
        sectionAverage,
        elements: funcaoScores,
      };

      totalSectionAverage += parseFloat(sectionAverage);

      // Adicionar linha para esta função com fundo azul claro
      const funcaoRow = worksheet.getRow(currentRow);

      // Nome da função com negrito
      const funcaoNameCell = funcaoRow.getCell(1);
      funcaoNameCell.value = funcaoMacro;
      funcaoNameCell.font = { bold: true };
      funcaoNameCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Média da seção
      const funcaoMediaCell = funcaoRow.getCell(2);
      funcaoMediaCell.value = sectionAverage;
      funcaoMediaCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      funcaoMediaCell.alignment = { horizontal: 'center' };

      // Médias dos elementos
      for (let i = 0; i < sectionElements.length; i++) {
        const elementValue = funcaoScores[sectionElements[i]] || '0.0';
        const elementCell = funcaoRow.getCell(i + 3);
        elementCell.value = elementValue;
        elementCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        elementCell.alignment = { horizontal: 'center' };
      }
      
      // Aplicar fundo azul claro para toda a linha da função
      for (let i = 1; i <= sectionElements.length + 2; i++) {
        const cell = funcaoRow.getCell(i);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ADD8E6' }, // Azul claro
        };
      }

      currentRow++;
      
      // Adicionar detalhes específicos abaixo de cada função
      if (funcaoMacro === 'Conselho') {
        // Para Conselho, listar usuários individuais
        for (const user of funcaoUsers) {
          const userScores = await scoreService.calculateGroupScores(user.id);
          const userRow = worksheet.getRow(currentRow);
          
          // Nome do usuário com identação
          const userNameCell = userRow.getCell(1);
          userNameCell.value = `   ${user.nome}`;
          userNameCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          
          // Calcular média da seção
          let userSectionTotal = 0;
          let userValidElementsCount = 0;
          
          for (const element of sectionElements) {
            if (userScores[element]) {
              userSectionTotal += parseFloat(userScores[element]);
              userValidElementsCount++;
            }
          }
          
          const userSectionAverage = 
            userValidElementsCount > 0 
              ? (userSectionTotal / userValidElementsCount).toFixed(1) 
              : '0.0';
              
          // Média da seção para o usuário
          const userMediaCell = userRow.getCell(2);
          userMediaCell.value = userSectionAverage;
          userMediaCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          userMediaCell.alignment = { horizontal: 'center' };
          
          // Médias dos elementos para o usuário
          for (let i = 0; i < sectionElements.length; i++) {
            const elementValue = userScores[sectionElements[i]] || '0.0';
            const elementCell = userRow.getCell(i + 3);
            elementCell.value = elementValue;
            elementCell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            elementCell.alignment = { horizontal: 'center' };
          }
          
          currentRow++;
        }
      } else if (['Diretor', 'Equipe', 'Gerente'].includes(funcaoMacro)) {
        // Para Diretor, Equipe, Gerente, listar filiais
        for (const filial of filiais) {
          // Filtrar usuários desta função que pertencem a esta filial
          const filialUsers = funcaoUsers.filter(user => user.filialId === filial.id);
          
          if (filialUsers.length === 0) continue;
          
          // Calcular média dos elementos da seção para esta filial
          const filialScores = 
            await scoreService.calculateAverageGroupScores(filialUsers);
            
          const filialRow = worksheet.getRow(currentRow);
          
          // Nome da filial com identação
          const filialNameCell = filialRow.getCell(1);
          filialNameCell.value = `   ${filial.filial}`;
          filialNameCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          
          // Calcular média da seção para esta filial
          let filialSectionTotal = 0;
          let filialValidElementsCount = 0;
          
          for (const element of sectionElements) {
            if (filialScores[element]) {
              filialSectionTotal += parseFloat(filialScores[element]);
              filialValidElementsCount++;
            }
          }
          
          const filialSectionAverage = 
            filialValidElementsCount > 0 
              ? (filialSectionTotal / filialValidElementsCount).toFixed(1) 
              : '0.0';
              
          // Média da seção para a filial
          const filialMediaCell = filialRow.getCell(2);
          filialMediaCell.value = filialSectionAverage;
          filialMediaCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          filialMediaCell.alignment = { horizontal: 'center' };
          
          // Médias dos elementos para a filial
          for (let i = 0; i < sectionElements.length; i++) {
            const elementValue = filialScores[sectionElements[i]] || '0.0';
            const elementCell = filialRow.getCell(i + 3);
            elementCell.value = elementValue;
            elementCell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            elementCell.alignment = { horizontal: 'center' };
          }
          
          currentRow++;
        }
      }
    }

    // Adicionar linha de total geral
    // ...código atual para adicionar a linha de total...
    const totalRow = worksheet.getRow(currentRow);

    // Total Geral (primeira coluna)
    const totalLabelCell = totalRow.getCell(1);
    totalLabelCell.value = 'Total Geral';
    totalLabelCell.font = {
      bold: true,
      color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' },
    };
    totalLabelCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor },
    };
    totalLabelCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Média total da seção
    const totalSectionCell = totalRow.getCell(2);
    const totalSectionValue =
      activeFuncoesCount > 0
        ? (totalSectionAverage / activeFuncoesCount).toFixed(1)
        : '0.0';

    totalSectionCell.value = totalSectionValue;
    totalSectionCell.font = {
      bold: true,
      color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' },
    };
    totalSectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor },
    };
    totalSectionCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    totalSectionCell.alignment = { horizontal: 'center' };

    // Médias totais dos elementos
    for (let i = 0; i < sectionElements.length; i++) {
      const element = sectionElements[i];
      const elementTotalValue =
        activeFuncoesCount > 0
          ? (totalElementAverages[element] / activeFuncoesCount).toFixed(1)
          : '0.0';

      const elementTotalCell = totalRow.getCell(i + 3);
      elementTotalCell.value = elementTotalValue;
      elementTotalCell.font = {
        bold: true,
        color: { argb: sectionType === 'METODO' ? 'FFFFFF' : '000000' },
      };
      elementTotalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColor },
      };
      elementTotalCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      elementTotalCell.alignment = { horizontal: 'center' };
    }

    currentRow++;
    return currentRow;
  }
}