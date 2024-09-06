import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalculoService {
  constructor(private prisma: PrismaService) {}

  async calculateGroupScores(userId: number) {
    const responses = await this.prisma.userResponse.findMany({
      where: { userId: userId },
    });

    const groups = {
      'modelo de liderança': [1, 7, 16, 4, 10, 13],
      'propósito': [6, 9, 14, 2, 11, 17],
      'valores': [3, 12, 18, 5, 8, 15],
      'Estrutura Sistêmica': [19, 34, 28, 31],
      'DF Intenção': [24, 27, 20, 29],
      'DP Vocação': [21, 30, 32, 36],
      'DC Conexão': [26, 35, 22, 38],
      'DE Valoração': [25, 37, 23, 33],
      'Roda do Aprendizado - Lirença educadora': [39, 50],
      'Conversa de Valor - Qualidade de diálogo': [40, 51],
      'Princípio da Linha d`água - Autonomia e autoridade': [41, 52],
      'Experiência - Fidelização e engajamento': [53, 42],
      'Ilha das Competências - Pontencial da equipe': [54, 53],
      'Operação Curiosidade - Comportamento empreendedor': [44, 55],
      'Metaprojeto - Trabalho com significado': [45, 56],
      'Metaprocesso - Eficácia operacional': [46, 57],
      'Musa - Inovação e criatividade': [58, 47],
      'Balanço das Riquezas - Resultados plenos': [59, 48],
      'Planta de Serviços - Momentos da verdade': [49, 60],
    };

    const percentageReferences = {
      'modelo de liderança': 60,
      'propósito': 60,
      'valores': 60,
      'Estrutura Sistêmica': 40,
      'DF Intenção': 40,
      'DP Vocação': 40,
      'DC Conexão': 40,
      'DE Valoração': 40,
      'Roda do Aprendizado - Lirença educadora': 20,
      'Conversa de Valor - Qualidade de diálogo': 20,
      'Princípio da Linha d`água - Autonomia e autoridade': 20,
      'Experiência - Fidelização e engajamento': 20,
      'Ilha das Competências - Pontencial da equipe': 20,
      'Operação Curiosidade - Comportamento empreendedor': 20,
      'Metaprojeto - Trabalho com significado': 20,
      'Metaprocesso - Eficácia operacional': 20,
      'Musa - Inovação e criatividade': 20,
      'Balanço das Riquezas - Resultados plenos': 20,
      'Planta de Serviços - Momentos da verdade': 20,
    };

    const result = {};

    for (const [groupName, questionNumbers] of Object.entries(groups)) {
      const totalScore = responses
        .filter((response) => questionNumbers.includes(response.question))
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
      { header: 'RESULTADO EM %', key: 'score', width: 20, style: { alignment: { horizontal: 'center' } } },
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

      const row = worksheet.addRow({ aspect, groupName: '', score: aspectAverage });

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
    const users = await this.prisma.users.findMany({
      include: { respostas: true, filial: true },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resultados');

    const groupNames = [
      'modelo de liderança', 'propósito', 'valores', 
      'Estrutura Sistêmica', 'DF Intenção', 'DP Vocação', 'DC Conexão', 'DE Valoração', 
      'Roda do Aprendizado - Lirença educadora', 'Conversa de Valor - Qualidade de diálogo', 
      'Princípio da Linha d`água - Autonomia e autoridade', 'Experiência - Fidelização e engajamento', 
      'Ilha das Competências - Pontencial da equipe', 'Operação Curiosidade - Comportamento empreendedor', 
      'Metaprojeto - Trabalho com significado', 'Metaprocesso - Eficácia operacional', 'Musa - Inovação e criatividade', 
      'Balanço das Riquezas - Resultados plenos', 'Planta de Serviços - Momentos da verdade'
    ];

    worksheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      ...groupNames.map(groupName => ({ header: groupName, key: groupName, width: 20 }))
    ];

    for (const user of users) {
      const scores = await this.calculateGroupScores(user.id);
      const row = { nome: user.nomeCompleto, ...scores };
      worksheet.addRow(row);
    }

    // Adiciona a nova aba "inf.adicionais"
    const additionalInfoSheet = workbook.addWorksheet('inf.adicionais');

    additionalInfoSheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      { header: 'TEMPO_EMPRESA', key: 'tempoEmpresa', width: 20 },
      { header: 'FILIAL', key: 'filial', width: 20 },
      { header: 'FUNCAO', key: 'funcao', width: 20 },
      { header: 'GENERO', key: 'genero', width: 20 },
      { header: 'CIDADE', key: 'cidade', width: 20 },
    ];

    for (const user of users) {
      const row = {
        nome: user.nomeCompleto,
        tempoEmpresa: user.tempoEmpresa,
        filial: user.filial?.filial,
        funcao: user.funcao,
        genero: user.genero,
        cidade: user.cidade,
      };
      additionalInfoSheet.addRow(row);
    }

    // Adiciona a nova aba "Respostas"
    const responsesSheet = workbook.addWorksheet('Respostas');

    responsesSheet.columns = [
      { header: 'NOME', key: 'nome', width: 30 },
      { header: 'PERGUNTA', key: 'pergunta', width: 20 },
      { header: 'VALOR', key: 'valor', width: 20 },
      { header: 'TEMPO_EMPRESA', key: 'tempoEmpresa', width: 20 },
      { header: 'FILIAL', key: 'filial', width: 20 },
      { header: 'FUNCAO', key: 'funcao', width: 20 },
      { header: 'GENERO', key: 'genero', width: 20 },
      { header: 'CIDADE', key: 'cidade', width: 20 },
    ];

    for (const user of users) {
        const sortedResponses = user.respostas.sort((a, b) => a.question - b.question);
        for (const response of sortedResponses) {
          const row = {
            nome: user.nomeCompleto,
            pergunta: response.question, //trocar para o texto da pergunta
            valor: response.score,
            tempoEmpresa: user.tempoEmpresa,
            filial: user.filial?.filial,
            funcao: user.funcao,
            genero: user.genero,
            cidade: user.cidade,
          };
          responsesSheet.addRow(row);
        }
      }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'TabeladeResultados.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
