// import { Injectable, Logger } from '@nestjs/common';
// import { Response } from 'express';
// import * as ExcelJS from 'exceljs';
// import { PrismaService } from 'src/prisma/prisma.service';

// interface GroupScores {
//   [groupName: string]: string;
// }

// interface GroupConfig {
//   questionIds: number[];
// }

// @Injectable()
// export class CalculoService {
//   private readonly logger = new Logger(CalculoService.name);
//   constructor(private readonly prisma: PrismaService) {}

//   private getDynamicField(
//     user: any,
//     fieldName: string,
//     defaultValue: any = '',
//   ): any {
//     if (user[fieldName] !== undefined) {
//       return user[fieldName];
//     }

//     if (
//       user.dynamicResponses &&
//       user.dynamicResponses[fieldName] !== undefined
//     ) {
//       return user.dynamicResponses[fieldName];
//     }
//     return defaultValue;
//   }

//   async getQuestionText(questionId: number): Promise<string> {
//     try {
//       const question = await this.prisma.question.findUnique({
//         where: { id: questionId },
//       });
      
//       if (!question) {
//         this.logger.warn(`Pergunta não encontrada para ID: ${questionId}`);
//         return 'Pergunta não encontrada';
//       }
      
//       return question.text;
//     } catch (error) {
//       this.logger.error(`Erro ao buscar pergunta ${questionId}: ${error.message}`);
//       throw new Error(`Falha ao buscar texto da pergunta: ${error.message}`);
//     }
//   }

//   async calculateGroupScores(userId: number) {
//     const responses = await this.prisma.userResponse.findMany({
//       where: { userId: userId },
//     });

//     const GROUPS_CONFIG: Record<string, GroupConfig> = {
//       'modelo de liderança': {
//         questionIds: [1, 7, 16, 4, 10, 13],
//       },
//       'propósito': {
//         questionIds: [6, 9, 14, 2, 11, 17],
//       },
//       'valores': { questionIds: [3, 12, 18, 5, 8, 15]},
//       'Estrutura Sistêmica': {
//         questionIds: [19, 34, 28, 31],
//       },
//       'DF Intenção': { questionIds: [24, 27, 20, 29]},
//       'DP Vocação': { questionIds: [21, 30, 32, 36] },
//       'DC Conexão': { questionIds: [26, 35, 22, 38] },
//       'DE Valoração': {
//         questionIds: [25, 37, 23, 33],
//       },
//       'Roda do Aprendizado - Liderança educadora': {
//         questionIds: [39, 50],
//       },
//       'Conversa de Valor - Qualidade de diálogo': {
//         questionIds: [40, 51],
//       },
//       'Princípio da Linha d`água - Autonomia e autoridade': {
//         questionIds: [41, 52],
//       },
//       'Experiência - Fidelização e engajamento': {
//         questionIds: [53, 42],
//       },
//       'Ilha das Competências - Potencial da equipe': {
//         questionIds: [54, 53],
//       },
//       'Operação Curiosidade - Comportamento empreendedor': {
//         questionIds: [44, 55],
//       },
//       'Metaprojeto - Trabalho com significado': {
//         questionIds: [45, 56],
//       },
//       'Metaprocesso - Eficácia operacional': {
//         questionIds: [46, 57],
//       },
//       'Musa - Inovação e criatividade': {
//         questionIds: [58, 47],
//       },
//       'Balanço das Riquezas - Resultados plenos': {
//         questionIds: [59, 48],
//       },
//       'Planta de Serviços - Momentos da verdade': {
//         questionIds: [49, 60],
//       },
//     };

//     const percentageReferences = {
//       'modelo de liderança': 60,
//       'propósito': 60,
//       'valores': 60,
//       'Estrutura Sistêmica': 40,
//       'DF Intenção': 40,
//       'DP Vocação': 40,
//       'DC Conexão': 40,
//       'DE Valoração': 40,
//       'Roda do Aprendizado - Liderança educadora': 20,
//       'Conversa de Valor - Qualidade de diálogo': 20,
//       'Princípio da Linha d`água - Autonomia e autoridade': 20,
//       'Experiência - Fidelização e engajamento': 20,
//       'Ilha das Competências - Potencial da equipe': 20,
//       'Operação Curiosidade - Comportamento empreendedor': 20,
//       'Metaprojeto - Trabalho com significado': 20,
//       'Metaprocesso - Eficácia operacional': 20,
//       'Musa - Inovação e criatividade': 20,
//       'Balanço das Riquezas - Resultados plenos': 20,
//       'Planta de Serviços - Momentos da verdade': 20,
//     };

//     const result = {};

//     for (const [groupName, config] of Object.entries(GROUPS_CONFIG)) {
//       const totalScore = responses
//         .filter((response) => config.questionIds.includes(response.question))
//         .reduce((sum, response) => sum + response.score, 0);
  
//       const percentageReference = percentageReferences[groupName];
//       result[groupName] = ((totalScore / percentageReference) * 100).toFixed(1);
//     }
  
//     console.log(result);
//     return result;
//   }

//   async generateExcelUserIndividualScores(userId: number, res: Response) {
//     const scores = await this.calculateGroupScores(userId);

//     const aspects = {
//       FILOSOFIA: ['modelo de liderança', 'propósito', 'valores'],
//       ESTRATEGIA: [
//         'Estrutura Sistêmica',
//         'DF Intenção',
//         'DP Vocação',
//         'DC Conexão',
//         'DE Valoração',
//       ],
//       METODO: [
//         'Roda do Aprendizado - Liderança educadora',
//         'Conversa de Valor - Qualidade de diálogo',
//         'Princípio da Linha d`água - Autonomia e autoridade',
//         'Experiência - Fidelização e engajamento',
//         'Ilha das Competências - Potencial da equipe',
//         'Operação Curiosidade - Comportamento empreendedor',
//         'Metaprojeto - Trabalho com significado',
//         'Metaprocesso - Eficácia operacional',
//         'Musa - Inovação e criatividade',
//         'Balanço das Riquezas - Resultados plenos',
//         'Planta de Serviços - Momentos da verdade',
//       ],
//     };

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Scores');

//     worksheet.columns = [
//       { header: 'ASPECTO', key: 'aspect', width: 20 },
//       { header: 'ELEMENTO', key: 'groupName', width: 50 },
//       {
//         header: 'RESULTADO EM %',
//         key: 'score',
//         width: 20,
//         style: { alignment: { horizontal: 'center' } },
//       },
//     ];

//     worksheet.getRow(1).eachCell((cell) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '000000' },
//       };
//       cell.font = {
//         color: { argb: 'FFFFFF' },
//         bold: true,
//       };
//     });

//     for (const [aspect, groupNames] of Object.entries(aspects)) {
//       const aspectScores = groupNames.map((groupName) =>
//         parseFloat(scores[groupName]),
//       );
//       const aspectAverage = (
//         aspectScores.reduce((sum, score) => sum + score, 0) /
//         aspectScores.length
//       ).toFixed(1);

//       const row = worksheet.addRow({
//         aspect,
//         groupName: '',
//         score: aspectAverage,
//       });

//       let fillColor;
//       if (aspect === 'FILOSOFIA') {
//         fillColor = 'FFFF00'; // Amarelo
//       } else if (aspect === 'ESTRATEGIA') {
//         fillColor = 'FFA500'; // Laranja
//       } else if (aspect === 'METODO') {
//         fillColor = '008000'; // Verde
//       }

//       row.eachCell((cell) => {
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: fillColor },
//         };
//       });

//       for (const groupName of groupNames) {
//         worksheet.addRow({ aspect, groupName, score: scores[groupName] });
//       }
//     }

//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );
//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=' + 'ResultadoIndividual.xlsx',
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   }

//   async calculateAndGenerateExcel(userId: number, res: Response) {
//     await this.generateExcelUserIndividualScores(userId, res);
//   }

//   async generateExcelWithUserResults(res: Response) {
//     try {
//       this.logger.log('Iniciando geração do Excel com resultados de usuários');
      
//       const users = await this.prisma.users.findMany({
//         include: { 
//           respostas: true, 
//           filial: {
//             include: {
//               company: true
//             }
//           } 
//         },
//       });
      
//       this.logger.log(`Recuperados ${users.length} usuários para processamento`);
      
//       const workbook = new ExcelJS.Workbook();

//       const companyName = users.length > 0 && users[0].filial?.company?.name ? 
//       users[0].filial.company.name : 'EMPRESA';

//       this.logger.log('Criando planilha de dados dos usuários');
//       await this.createUserDataWorksheet(workbook, users, companyName);

//       this.logger.log('Criando planilha geral com médias por grupo');
//       await this.createGeneralWorksheet(workbook, users);
      
//       this.logger.log('Criando planilha de resultados');
//       await this.createResultsWorksheet(workbook, users);
      
//       this.logger.log('Criando planilha de informações adicionais');
//       this.createAdditionalInfoWorksheet(workbook, users);
      
//       this.logger.log('Criando planilha de respostas');
//       await this.createResponsesWorksheet(workbook, users);
      
//       this.logger.log('Configurando download do Excel');
//       await this.configureExcelDownload(res, 'TabeladeResultados.xlsx', workbook);
      
//       this.logger.log('Excel gerado com sucesso');
//     } catch (error) {
//       this.logger.error(`Erro ao gerar Excel: ${error.message}`);
//       throw error;
//     }
//   }

//   private async calculateAverageGroupScores(users: any[], filter?: (user: any) => boolean): Promise<Record<string, string>> {
//     const filteredUsers = filter ? users.filter(filter) : users;
    
//     if (filteredUsers.length === 0) {
//       return this.getGroupNames().reduce((acc, groupName) => {
//         acc[groupName] = "0.0";
//         return acc;
//       }, {});
//     }
    
//     const allScores = await Promise.all(
//       filteredUsers.map(user => this.calculateGroupScores(user.id))
//     );
    
//     const groupTotals: Record<string, number> = {};
//     const groupCounts: Record<string, number> = {};
    
//     for (const userScores of allScores) {
//       for (const [groupName, score] of Object.entries(userScores)) {
//         if (!groupTotals[groupName]) {
//           groupTotals[groupName] = 0;
//           groupCounts[groupName] = 0;
//         }
//         groupTotals[groupName] += parseFloat(score as string);
//         groupCounts[groupName]++;
//       }
//     }
    
//     const averages: Record<string, string> = {};
//     for (const groupName of Object.keys(groupTotals)) {
//       averages[groupName] = (groupTotals[groupName] / groupCounts[groupName]).toFixed(1);
//     }
    
//     return averages;
//   }

//   private async createUserDataWorksheet(workbook: ExcelJS.Workbook, users: any[], companyName: string): Promise<void> {
//     const worksheet = workbook.addWorksheet(`DADOS ${companyName}`);
    
//     worksheet.columns = [
//       { header: 'NOME_FUNCIONARIO', key: 'nome', width: 30 },
//       { header: 'NOME_FILIAL', key: 'filial', width: 25 },
//       { header: 'CIDADE', key: 'cidade', width: 20 },
//       { header: 'FUNCAO', key: 'funcaoMacro', width: 25 },
//       { header: 'GENERO', key: 'genero', width: 20 },
//     ];
    
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '000000' },
//       };
//       cell.font = {
//         color: { argb: 'FFFFFF' },
//         bold: true,
//       };
//     });

//     worksheet.autoFilter = {
//       from: 'A1',
//       to: 'E1',
//     };
    
//     for (const user of users) {
//       worksheet.addRow({
//         nome: user.nome,
//         filial: user.filial?.filial?.toUpperCase() || 'N/A',
//         cidade: user.cidade,
//         funcaoMacro: user.funcaoMacro,
//         genero: user.genero,
//       });
//     }
    
//     worksheet.columns.forEach((column, index) => {
//       if (index < worksheet.columns.length - 1) {
//         const colLetter = String.fromCharCode(65 + index);
//         const lastRow = worksheet.rowCount;
        
//         for (let row = 1; row <= lastRow; row++) {
//           const cell = worksheet.getCell(`${colLetter}${row}`);
//           cell.border = {
//             ...cell.border,
//             right: { style: 'thin', color: { argb: 'CCCCCC' } }
//           };
//         }
//       }
//     });
//   }

//   private async createGeneralWorksheet(workbook: ExcelJS.Workbook, users: any[]): Promise<void> {
//     this.logger.log('Iniciando criação da planilha GERAL');
    
//     // Criar planilha GERAL com fundo amarelo
//     const worksheet = workbook.addWorksheet('GERAL', {
//       properties: {
//         tabColor: { argb: 'FFFF00' }
//       }
//     });
    
//     // Definir estrutura de aspectos e seus elementos
//     const aspects = {
//       FILOSOFIA: ['modelo de liderança', 'propósito', 'valores'],
//       ESTRATEGIA: [
//         'Estrutura Sistêmica',
//         'DF Intenção',
//         'DP Vocação',
//         'DC Conexão',
//         'DE Valoração',
//       ],
//       METODO: [
//         'Roda do Aprendizado - Liderança educadora',
//         'Conversa de Valor - Qualidade de diálogo',
//         'Princípio da Linha d`água - Autonomia e autoridade',
//         'Experiência - Fidelização e engajamento',
//         'Ilha das Competências - Potencial da equipe',
//         'Operação Curiosidade - Comportamento empreendedor',
//         'Metaprojeto - Trabalho com significado',
//         'Metaprocesso - Eficácia operacional',
//         'Musa - Inovação e criatividade',
//         'Balanço das Riquezas - Resultados plenos',
//         'Planta de Serviços - Momentos da verdade',
//       ],
//     };
    
//     // Calcular médias para diferentes grupos
//     this.logger.log('Calculando médias para todos os usuários');
//     const allUserScores = await this.calculateAverageGroupScores(users);
    
//     this.logger.log('Calculando médias para gerentes');
//     const managerScores = await this.calculateAverageGroupScores(users, 
//       user => user.funcaoMacro && user.funcaoMacro.includes('Gerente'));
      
//     this.logger.log('Calculando médias para equipe');
//     const teamScores = await this.calculateAverageGroupScores(users, 
//       user => user.funcaoMacro && user.funcaoMacro.includes('Equipe'));
    
//     // Configurar cabeçalhos
//     worksheet.columns = [
//       { key: 'aspect', width: 20 },    // Primeira coluna: GERAL
//       { key: 'element', width: 60 },   // Segunda coluna: Elementos
//       { key: 'group', width: 15 },     // Terceira coluna: GRUPO
//       { key: 'managers', width: 15 },  // Quarta coluna: GERENTES
//       { key: 'team', width: 15 }       // Quinta coluna: EQUIPE
//     ];
    
//     // Adicionar cabeçalhos
//     const headerRow = worksheet.addRow(['GERAL', '', 'GRUPO', 'GERENTES', 'EQUIPE']);
//     headerRow.eachCell((cell, colNumber) => {
//       if (colNumber !== 2) { // Pular a coluna sem nome
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: '0000FF' } // Azul
//         };
//         cell.font = {
//           color: { argb: 'FFFFFF' }, // Branco
//           bold: true
//         };
//         cell.border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
//       }
//     });
    
//     let currentRow = 2;
    
//     const addAspect = (aspect: string, elements: string[], color: string, textColor: string = '000000') => {
//       const aspectRow = worksheet.getRow(currentRow);
//       aspectRow.getCell(1).value = aspect;
//       aspectRow.getCell(1).fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: color }
//       };
//       aspectRow.getCell(1).font = {
//         bold: true,
//         color: { argb: textColor }
//       };
//       aspectRow.getCell(1).border = {
//         top: { style: 'thin', color: { argb: '000000' } },
//         left: { style: 'thin', color: { argb: '000000' } },
//         bottom: { style: 'thin', color: { argb: '000000' } },
//         right: { style: 'thin', color: { argb: '000000' } }
//       };
      
//       for (let i = 0; i < elements.length; i++) {
//         const row = worksheet.getRow(currentRow + i);
//         const elementName = elements[i];

//         row.getCell(2).value = elementName.toUpperCase();
//         row.getCell(2).border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
        
//         row.getCell(3).value = parseFloat(allUserScores[elementName] || '0');
//         row.getCell(3).border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
        
//         row.getCell(4).value = parseFloat(managerScores[elementName] || '0');
//         row.getCell(4).border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
        
//         row.getCell(5).value = parseFloat(teamScores[elementName] || '0');
//         row.getCell(5).border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
//       }
      
//       currentRow += elements.length;
//     };
    
//     const addBlankRow = () => {
//       const row = worksheet.getRow(currentRow);
//       for (let i = 1; i <= 5; i++) {
//         row.getCell(i).border = {
//           top: { style: 'thin', color: { argb: '000000' } },
//           left: { style: 'thin', color: { argb: '000000' } },
//           bottom: { style: 'thin', color: { argb: '000000' } },
//           right: { style: 'thin', color: { argb: '000000' } }
//         };
//       }
//       currentRow++;
//     };
    
//     addAspect('FILOSOFIA', aspects.FILOSOFIA, 'FFFF00');
//     addBlankRow();
//     addAspect('ESTRATEGIA', aspects.ESTRATEGIA, 'FFA500');
//     addBlankRow();
//     addAspect('METODO', aspects.METODO, '008000', 'FFFFFF');
    
//     for (let i = 2; i <= currentRow; i++) {
//       for (let j = 3; j <= 5; j++) {
//         const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
//         if (typeof cell.value === 'number') {
//           cell.numFmt = '0.0';
//         }
//       }
//     }
    
//     this.logger.log('Planilha GERAL criada com sucesso');
//   }

//   private async createResultsWorksheet(workbook: ExcelJS.Workbook, users: any[]): Promise<void> {
//     const worksheet = workbook.addWorksheet('Resultados');
//     const groupNames = this.getGroupNames();
  
//     worksheet.columns = [
//       { header: 'NOME', key: 'nome', width: 30 },
//       ...groupNames.map((groupName) => ({
//         header: groupName,
//         key: groupName,
//         width: 20,
//       })),
//     ];
  
//     worksheet.autoFilter = {
//       from: 'A1',
//       to: `${String.fromCharCode(65 + groupNames.length)}1`,
//     };
  
//     for (const user of users) {
//       const scores = await this.calculateGroupScores(user.id);
//       const row = { nome: user.nome, ...scores };
//       worksheet.addRow(row);
//     }
//   }
  
//   private createAdditionalInfoWorksheet(workbook: ExcelJS.Workbook, users: any[]): void {
//     const additionalInfoSheet = workbook.addWorksheet('inf.adicionais');
//     const dynamicKeys = this.extractDynamicKeysFromUsers(users);
  
//     const columns: Partial<ExcelJS.Column>[] = [
//       { header: 'NOME', key: 'nome', width: 30 },
//       { header: 'FILIAL', key: 'filial', width: 20 },
//     ];
  
//     Array.from(dynamicKeys)
//       .sort()
//       .forEach((key) => {
//         columns.push({
//           header: key.toUpperCase(),
//           key: key,
//           width: 20,
//         });
//       });
  
//     additionalInfoSheet.columns = columns as ExcelJS.Column[];
  
//     if (columns.length > 0) {
//       additionalInfoSheet.autoFilter = {
//         from: 'A1',
//         to: `${String.fromCharCode(65 + columns.length - 1)}1`,
//       };
//     }
  
//     for (const user of users) {
//       const row: any = {
//         nome: user.nome,
//         filial: user.filial?.filial,
//       };
  
//       if (user.dynamicResponses) {
//         Object.entries(user.dynamicResponses).forEach(([key, value]) => {
//           row[key] = value;
//         });
//       }
  
//       additionalInfoSheet.addRow(row);
//     }
//   }
  
//   private async createResponsesWorksheet(workbook: ExcelJS.Workbook, users: any[]): Promise<void> {
//     const responsesSheet = workbook.addWorksheet('Respostas');
  
//     responsesSheet.columns = [
//       { header: 'NOME', key: 'nome', width: 30 },
//       { header: 'PERGUNTA', key: 'pergunta', width: 20 },
//       { header: 'VALOR', key: 'valor', width: 20 },
//       { header: 'FILIAL', key: 'filial', width: 20 },
//       { header: 'FUNCAO', key: 'funcao', width: 20 },
//       { header: 'GENERO', key: 'genero', width: 20 },
//       { header: 'CIDADE', key: 'cidade', width: 20 },
//     ];
  
//     responsesSheet.autoFilter = {
//       from: 'A1',
//       to: 'G1',
//     };
  
//     for (const user of users) {
//       const sortedResponses = user.respostas.sort(
//         (a, b) => a.question - b.question,
//       );
//       for (const response of sortedResponses) {
//         const questionText = await this.getQuestionText(response.question);
//         const row = {
//           nome: user.nome,
//           pergunta: questionText,
//           valor: response.score,
//           filial: user.filial?.filial,
//           funcao: this.getDynamicField(user, 'funcao'),
//           cidade: this.getDynamicField(user, 'cidade'),
//           genero: this.getDynamicField(user, 'genero'),
//         };
//         responsesSheet.addRow(row);
//       }
//     }
//   }
  
//   private async configureExcelDownload(res: Response, filename: string, workbook: ExcelJS.Workbook): Promise<void> {
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename=${filename}`,
//     );
    
//     try {
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       this.logger.error(`Erro ao escrever Excel: ${error.message}`);
//       throw new Error(`Falha ao gerar arquivo Excel: ${error.message}`);
//     }
//   }
  
//   private getGroupNames(): string[] {
//     return [
//       'modelo de liderança',
//       'propósito',
//       'valores',
//       'Estrutura Sistêmica',
//       'DF Intenção',
//       'DP Vocação',
//       'DC Conexão',
//       'DE Valoração',
//       'Roda do Aprendizado - Liderança educadora',
//       'Conversa de Valor - Qualidade de diálogo',
//       'Princípio da Linha d`água - Autonomia e autoridade',
//       'Experiência - Fidelização e engajamento',
//       'Ilha das Competências - Potencial da equipe',
//       'Operação Curiosidade - Comportamento empreendedor',
//       'Metaprojeto - Trabalho com significado',
//       'Metaprocesso - Eficácia operacional',
//       'Musa - Inovação e criatividade',
//       'Balanço das Riquezas - Resultados plenos',
//       'Planta de Serviços - Momentos da verdade',
//     ];
//   }
  
//   private extractDynamicKeysFromUsers(users: any[]): Set<string> {
//     const dynamicKeys = new Set<string>();
//     users.forEach((user) => {
//       if (user.dynamicResponses) {
//         Object.keys(user.dynamicResponses).forEach((key) => {
//           dynamicKeys.add(key);
//         });
//       }
//     });
//     return dynamicKeys;
//   }
// }
