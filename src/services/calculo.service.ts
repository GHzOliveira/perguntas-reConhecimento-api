import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';

interface GroupScores {
  [groupName: string]: string;
}

interface GroupConfig {
  questionIds: number[];
  percentageReference: number;
}

@Injectable()
export class CalculoService {
  private readonly logger = new Logger(CalculoService.name);
  constructor(private readonly prisma: PrismaService) {}

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

  async getQuestionText(questionId: number): Promise<string> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id: questionId },
      });
      
      if (!question) {
        this.logger.warn(`Pergunta não encontrada para ID: ${questionId}`);
        return 'Pergunta não encontrada';
      }
      
      return question.text;
    } catch (error) {
      this.logger.error(`Erro ao buscar pergunta ${questionId}: ${error.message}`);
      throw new Error(`Falha ao buscar texto da pergunta: ${error.message}`);
    }
  }

  async calculateGroupScores(userId: number) {
    const responses = await this.prisma.userResponse.findMany({
      where: { userId: userId },
    });

    const GROUPS_CONFIG: Record<string, GroupConfig> = {
      'modelo de liderança': {
        questionIds: [1, 7, 16, 4, 10, 13],
        percentageReference: 60,
      },
      propósito: {
        questionIds: [6, 9, 14, 2, 11, 17],
        percentageReference: 60,
      },
      valores: { questionIds: [3, 12, 18, 5, 8, 15], percentageReference: 60 },
      'Estrutura Sistêmica': {
        questionIds: [19, 34, 28, 31],
        percentageReference: 60,
      },
      'DF Intenção': { questionIds: [24, 27, 20, 29], percentageReference: 60 },
      'DP Vocação': { questionIds: [21, 30, 32, 36], percentageReference: 60 },
      'DC Conexão': { questionIds: [26, 35, 22, 38], percentageReference: 60 },
      'DE Valoração': {
        questionIds: [25, 37, 23, 33],
        percentageReference: 60,
      },
      'Roda do Aprendizado - Licença educadora': {
        questionIds: [39, 50],
        percentageReference: 60,
      },
      'Conversa de Valor - Qualidade de diálogo': {
        questionIds: [40, 51],
        percentageReference: 60,
      },
      'Princípio da Linha d`água - Autonomia e autoridade': {
        questionIds: [41, 52],
        percentageReference: 60,
      },
      'Experiência - Fidelização e engajamento': {
        questionIds: [53, 42],
        percentageReference: 60,
      },
      'Ilha das Competências - Pontencial da equipe': {
        questionIds: [54, 53],
        percentageReference: 60,
      },
      'Operação Curiosidade - Comportamento empreendedor': {
        questionIds: [44, 55],
        percentageReference: 60,
      },
      'Metaprojeto - Trabalho com significado': {
        questionIds: [45, 56],
        percentageReference: 60,
      },
      'Metaprocesso - Eficácia operacional': {
        questionIds: [46, 57],
        percentageReference: 60,
      },
      'Musa - Inovação e criatividade': {
        questionIds: [58, 47],
        percentageReference: 60,
      },
      'Balanço das Riquezas - Resultados plenos': {
        questionIds: [59, 48],
        percentageReference: 60,
      },
      'Planta de Serviços - Momentos da verdade': {
        questionIds: [49, 60],
        percentageReference: 60,
      },
    };

    const percentageReferences = {
      'modelo de liderança': 60,
      propósito: 60,
      valores: 60,
      'Estrutura Sistêmica': 40,
      'DF Intenção': 40,
      'DP Vocação': 40,
      'DC Conexão': 40,
      'DE Valoração': 40,
      'Roda do Aprendizado - Lirença educadora': 20,
      'Conversa de Valor - Qualidade de diálogo': 20,
      'Princípio da Linha d`água - Autonomia e autoridade': 20,
      'Experiência - Fidelização e engajamento': 20,
      'Ilha das Competências - Potencial da equipe': 20,
      'Operação Curiosidade - Comportamento empreendedor': 20,
      'Metaprojeto - Trabalho com significado': 20,
      'Metaprocesso - Eficácia operacional': 20,
      'Musa - Inovação e criatividade': 20,
      'Balanço das Riquezas - Resultados plenos': 20,
      'Planta de Serviços - Momentos da verdade': 20,
    };

    const result = {};

    for (const [groupName, config] of Object.entries(GROUPS_CONFIG)) {
      const totalScore = responses
        .filter((response) => config.questionIds.includes(response.question))
        .reduce((sum, response) => sum + response.score, 0);
  
      const percentageReference = percentageReferences[groupName];
      result[groupName] = ((totalScore / percentageReference) * 100).toFixed(1);
    }
  

    return result;
  }

  async generateExcelUserIndividualScores(userId: number, res: Response) {
    const scores = await this.calculateGroupScores(userId);

    const aspects = {
      FILOSOFIA: ['modelo de liderança', 'propósito', 'valores'],
      ESTRATEGIA: [
        'Estrutura Sistêmica',
        'DF Intenção',
        'DP Vocação',
        'DC Conexão',
        'DE Valoração',
      ],
      METODO: [
        'Roda do Aprendizado - Lirença educadora',
        'Conversa de Valor - Qualidade de diálogo',
        'Princípio da Linha d`água - Autonomia e autoridade',
        'Experiência - Fidelização e engajamento',
        'Ilha das Competências - Pontencial da equipe',
        'Operação Curiosidade - Comportamento empreendedor',
        'Metaprojeto - Trabalho com significado',
        'Metaprocesso - Eficácia operacional',
        'Musa - Inovação e criatividade',
        'Balanço das Riquezas - Resultados plenos',
        'Planta de Serviços - Momentos da verdade',
      ],
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scores');

    worksheet.columns = [
      { header: 'ASPECTO', key: 'aspect', width: 20 },
      { header: 'ELEMENTO', key: 'groupName', width: 50 },
      {
        header: 'RESULTADO EM %',
        key: 'score',
        width: 20,
        style: { alignment: { horizontal: 'center' } },
      },
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

    for (const [aspect, groupNames] of Object.entries(aspects)) {
      const aspectScores = groupNames.map((groupName) =>
        parseFloat(scores[groupName]),
      );
      const aspectAverage = (
        aspectScores.reduce((sum, score) => sum + score, 0) /
        aspectScores.length
      ).toFixed(1);

      const row = worksheet.addRow({
        aspect,
        groupName: '',
        score: aspectAverage,
      });

      let fillColor;
      if (aspect === 'FILOSOFIA') {
        fillColor = 'FFFF00'; // Amarelo
      } else if (aspect === 'ESTRATEGIA') {
        fillColor = 'FFA500'; // Laranja
      } else if (aspect === 'METODO') {
        fillColor = '008000'; // Verde
      }

      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor },
        };
      });

      for (const groupName of groupNames) {
        worksheet.addRow({ aspect, groupName, score: scores[groupName] });
      }
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'ResultadoIndividual.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async calculateAndGenerateExcel(userId: number, res: Response) {
    await this.generateExcelUserIndividualScores(userId, res);
  }

  async generateExcelWithUserResults(res: Response) {
    try {
      this.logger.log('Iniciando geração do Excel com resultados de usuários');
      
      const users = await this.prisma.users.findMany({
        include: { respostas: true, filial: true },
      });
      
      this.logger.log(`Recuperados ${users.length} usuários para processamento`);
      
      const workbook = new ExcelJS.Workbook();
      
      this.logger.log('Criando planilha de resultados');
      await this.createResultsWorksheet(workbook, users);
      
      this.logger.log('Criando planilha de informações adicionais');
      this.createAdditionalInfoWorksheet(workbook, users);
      
      this.logger.log('Criando planilha de respostas');
      await this.createResponsesWorksheet(workbook, users);
      
      this.logger.log('Configurando download do Excel');
      await this.configureExcelDownload(res, 'TabeladeResultados.xlsx', workbook);
      
      this.logger.log('Excel gerado com sucesso');
    } catch (error) {
      this.logger.error(`Erro ao gerar Excel: ${error.message}`);
      throw error;
    }
  }

  private async createResultsWorksheet(workbook: ExcelJS.Workbook, users: any[]): Promise<void> {
    const worksheet = workbook.addWorksheet('Resultados');
    const groupNames = this.getGroupNames();
  
    worksheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      ...groupNames.map((groupName) => ({
        header: groupName,
        key: groupName,
        width: 20,
      })),
    ];
  
    worksheet.autoFilter = {
      from: 'A1',
      to: `${String.fromCharCode(65 + groupNames.length)}1`,
    };
  
    for (const user of users) {
      const scores = await this.calculateGroupScores(user.id);
      const row = { nome: user.nome, ...scores };
      worksheet.addRow(row);
    }
  }
  
  private createAdditionalInfoWorksheet(workbook: ExcelJS.Workbook, users: any[]): void {
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
  
    if (columns.length > 0) {
      additionalInfoSheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + columns.length - 1)}1`,
      };
    }
  
    for (const user of users) {
      const row: any = {
        nome: user.nome,
        filial: user.filial?.filial,
      };
  
      if (user.dynamicResponses) {
        Object.entries(user.dynamicResponses).forEach(([key, value]) => {
          row[key] = value;
        });
      }
  
      additionalInfoSheet.addRow(row);
    }
  }
  
  private async createResponsesWorksheet(workbook: ExcelJS.Workbook, users: any[]): Promise<void> {
    const responsesSheet = workbook.addWorksheet('Respostas');
  
    responsesSheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      { header: 'PERGUNTA', key: 'pergunta', width: 20 },
      { header: 'VALOR', key: 'valor', width: 20 },
      { header: 'FILIAL', key: 'filial', width: 20 },
      { header: 'FUNCAO', key: 'funcao', width: 20 },
      { header: 'GENERO', key: 'genero', width: 20 },
      { header: 'CIDADE', key: 'cidade', width: 20 },
    ];
  
    responsesSheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };
  
    for (const user of users) {
      const sortedResponses = user.respostas.sort(
        (a, b) => a.question - b.question,
      );
      for (const response of sortedResponses) {
        const questionText = await this.getQuestionText(response.question);
        const row = {
          nome: user.nome,
          pergunta: questionText,
          valor: response.score,
          filial: user.filial?.filial,
          funcao: this.getDynamicField(user, 'funcao'),
          cidade: this.getDynamicField(user, 'cidade'),
          genero: this.getDynamicField(user, 'genero'),
        };
        responsesSheet.addRow(row);
      }
    }
  }
  
  private async configureExcelDownload(res: Response, filename: string, workbook: ExcelJS.Workbook): Promise<void> {
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
  
  private getGroupNames(): string[] {
    return [
      'modelo de liderança',
      'propósito',
      'valores',
      'Estrutura Sistêmica',
      'DF Intenção',
      'DP Vocação',
      'DC Conexão',
      'DE Valoração',
      'Roda do Aprendizado - Licença educadora',
      'Conversa de Valor - Qualidade de diálogo',
      'Princípio da Linha d`água - Autonomia e autoridade',
      'Experiência - Fidelização e engajamento',
      'Ilha das Competências - Pontencial da equipe',
      'Operação Curiosidade - Comportamento empreendedor',
      'Metaprojeto - Trabalho com significado',
      'Metaprocesso - Eficácia operacional',
      'Musa - Inovação e criatividade',
      'Balanço das Riquezas - Resultados plenos',
      'Planta de Serviços - Momentos da verdade',
    ];
  }
  
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
