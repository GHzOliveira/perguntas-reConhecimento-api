import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class FilialWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(FilialWorksheetGenerator.name);

  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    const { users, filial, scoreService } = props;
    
    this.logger.log(`Iniciando criação da planilha para a filial: ${filial.filial}`);
    
    const worksheet = workbook.addWorksheet(filial.filial, {
      properties: {
        tabColor: { argb: 'FFFF00' }
      }
    });
    
    const aspects = scoreService.getAspectsDefinition();
    
    const filialUsers = users.filter(user => user.filialId === filial.id);
    
    this.logger.log(`Calculando médias para ${filialUsers.length} usuários da filial ${filial.filial}`);
    const allUserScores = await scoreService.calculateAverageGroupScores(filialUsers);
    
    this.logger.log('Calculando médias para gerentes da filial');
    const managerScores = await scoreService.calculateAverageGroupScores(filialUsers, 
      user => user.funcaoMacro.includes('Gerente'));
      
    this.logger.log('Calculando médias para equipe da filial');
    const teamScores = await scoreService.calculateAverageGroupScores(filialUsers, 
      user => user.funcaoMacro.includes('Equipe'));
    
    const diretores = filialUsers.filter(user => user.funcaoMacro.includes('Diretor'));
    
    const columns = [
      { key: 'aspect', width: 20 }, 
      { key: 'element', width: 60 },
    ];
    
    diretores.forEach((diretor, index) => {
      columns.push({ key: `diretor${index}`, width: 15 });
    });
    
    columns.push(
      { key: 'group', width: 15 },
      { key: 'managers', width: 15 }, 
      { key: 'team', width: 15 }
    );
    
    worksheet.columns = columns;
    
    const headerRow = ['FILIAL', ''];
    
    diretores.forEach(diretor => {
      headerRow.push(diretor.nome);
    });
    
    headerRow.push('GRUPO', 'GERENTES', 'EQUIPE');
    
    const row = worksheet.addRow(headerRow);
    row.eachCell((cell, colNumber) => {
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
    const addAspect = async (aspect: string, elements: string[], color: string, textColor: string = '000000') => {
      // Calcular scores individuais para cada diretor
      const diretoresScores = await Promise.all(
        diretores.map(diretor => scoreService.calculateGroupScores(diretor.id))
      );
      
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
        
        // Adicionar valores para cada diretor
        diretores.forEach((diretor, diretorIndex) => {
          const score = parseFloat(diretoresScores[diretorIndex][elementName] || '0');
          row.getCell(3 + diretorIndex).value = score;
          row.getCell(3 + diretorIndex).border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        });
        
        // Adicionar colunas finais (grupo, gerentes, equipe)
        const colOffset = diretores.length;
        
        row.getCell(3 + colOffset).value = parseFloat(allUserScores[elementName] || '0');
        row.getCell(3 + colOffset).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        
        row.getCell(4 + colOffset).value = parseFloat(managerScores[elementName] || '0');
        row.getCell(4 + colOffset).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        
        row.getCell(5 + colOffset).value = parseFloat(teamScores[elementName] || '0');
        row.getCell(5 + colOffset).border = {
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
      for (let i = 1; i <= 5 + diretores.length; i++) {
        row.getCell(i).border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      }
      currentRow++;
    };
    
    await addAspect('FILOSOFIA', aspects.FILOSOFIA, 'FFFF00');
    addBlankRow();
    await addAspect('ESTRATEGIA', aspects.ESTRATEGIA, 'FFA500');
    addBlankRow();
    await addAspect('METODO', aspects.METODO, '008000', 'FFFFFF');
    
    // Formatar células numéricas
    for (let i = 2; i <= currentRow; i++) {
      for (let j = 3; j <= 5 + diretores.length; j++) {
        const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
        if (typeof cell.value === 'number') {
          cell.numFmt = '0.0';
        }
      }
    }
    
    this.logger.log(`Planilha para filial ${filial.filial} criada com sucesso`);
  }
}