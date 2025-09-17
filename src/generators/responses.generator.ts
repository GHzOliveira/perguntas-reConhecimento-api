import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksheetGenerator, WorksheetGeneratorProps } from 'src/interface/worksheet-generator.interface';

@Injectable()
export class ResponsesWorksheetGenerator implements WorksheetGenerator {
  private readonly logger = new Logger(ResponsesWorksheetGenerator.name);

  async generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void> {
    this.logger.log('Iniciando geração da planilha de respostas');
    
    const { users, prisma } = props;
    
    if (!prisma || !(prisma instanceof PrismaService)) {
      throw new Error('PrismaService é necessário para gerar a planilha de respostas');
    }
    
    const responsesSheet = workbook.addWorksheet('Respostas');
  
    responsesSheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      { header: 'PERGUNTA', key: 'pergunta', width: 50 },
      { header: 'VALOR', key: 'valor', width: 15 },
      { header: 'FILIAL', key: 'filial', width: 20 },
      { header: 'FUNCAO', key: 'funcao', width: 20 },
      { header: 'GENERO', key: 'genero', width: 15 },
      { header: 'CIDADE', key: 'cidade', width: 20 },
    ];
    
    // Formatar cabeçalhos
    responsesSheet.getRow(1).eachCell((cell) => {
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
  
    responsesSheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };
    
    this.logger.log(`Processando respostas para ${users.length} usuários`);
    
    let rowCount = 0;

    for (const user of users) {
      const sortedResponses = user.respostas.sort(
        (a, b) => a.question - b.question,
      );
      
      for (const response of sortedResponses) {
        try {
          const questionText = await this.getQuestionText(prisma, response.question);
          
          const row = {
            nome: user.nome,
            pergunta: questionText,
            valor: response.score,
            filial: user.filial?.filial || 'N/A',
            funcao: this.getDynamicField(user, 'funcao'),
            cidade: this.getDynamicField(user, 'cidade'),
            genero: this.getDynamicField(user, 'genero'),
          };
          
          responsesSheet.addRow(row);
          rowCount++;
        } catch (error) {
          this.logger.error(`Erro ao processar resposta ${response.id} do usuário ${user.id}: ${error.message}`);
        }
      }
    }
    
    responsesSheet.columns.forEach((column, index) => {
      if (index < responsesSheet.columns.length - 1) {
        const colLetter = String.fromCharCode(65 + index);
        
        for (let row = 1; row <= responsesSheet.rowCount; row++) {
          const cell = responsesSheet.getCell(`${colLetter}${row}`);
          cell.border = {
            ...cell.border,
            right: { style: 'thin', color: { argb: 'CCCCCC' } }
          };
        }
      }
    });
    
    this.logger.log(`Planilha de respostas gerada com ${rowCount} linhas`);
  }

  /**
   * Busca o texto da pergunta pelo ID no banco de dados
   */
  private async getQuestionText(prisma: PrismaService, questionId: number): Promise<string> {
    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });
      
      if (!question) {
        return 'Pergunta não encontrada';
      }
      
      return question.text;
    } catch (error) {
      throw new Error(`Falha ao buscar texto da pergunta ${questionId}: ${error.message}`);
    }
  }

  /**
   * Obtém campo dinâmico do usuário, seja diretamente ou de respostas dinâmicas
   */
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
}