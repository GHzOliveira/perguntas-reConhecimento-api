import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelBaseService } from './excel-base.service';
import { UserDataGenerator } from 'src/generators/user-data.generator';
import { ScoreService } from '../calculo/score.service';
import { ResultsWorksheetGenerator } from 'src/generators/results.generator';
import { AdditionalInfoGenerator } from 'src/generators/additional-info.generator';
import { ResponsesWorksheetGenerator } from 'src/generators/responses.generator';
import { GeneralWorksheetGenerator } from 'src/generators/general.generator';
import { FilialWorksheetGenerator } from 'src/generators/filial.generator';
import { FilialAveragesWorksheetGenerator } from 'src/interface/filial-averages.generator';

@Injectable()
export class ExcelReportService {
  private readonly logger = new Logger(ExcelReportService.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelBaseService: ExcelBaseService,
    private readonly userDataGenerator: UserDataGenerator,
    private readonly generalWorksheetGenerator: GeneralWorksheetGenerator,
    private readonly filialWorksheetGenerator: FilialWorksheetGenerator,
    private readonly filialAveragesWorksheetGenerator: FilialAveragesWorksheetGenerator,
    private readonly resultsWorksheetGenerator: ResultsWorksheetGenerator,
    private readonly additionalInfoGenerator: AdditionalInfoGenerator,
    private readonly responsesWorksheetGenerator: ResponsesWorksheetGenerator,
    private readonly scoreService: ScoreService,
  ) {}

  async generateExcelWithUserResults(companyId: number, res: Response): Promise<void> {
    try {
      this.logger.log(`Iniciando geração do Excel com resultados de usuários da empresa ID: ${companyId}`);

      const company = await this.prisma.company.findUnique({
        where: { id: companyId }
      });
      
      if (!company) {
        throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
      }

      const filiais = await this.prisma.filial.findMany({
        where: { 
          companyId,
          status: 'ACTIVE'
        }
      });

      this.logger.log(`Recuperadas ${filiais.length} filiais da empresa ${company.name}`);
      
      const users = await this.prisma.users.findMany({
        where: { companyId },
        include: { 
          respostas: true, 
          filial: {
            include: {
              company: true
            }
          } 
        },
      });
      
      this.logger.log(`Recuperados ${users.length} usuários da empresa ${company.name} para processamento`);
    
      const workbook = new ExcelJS.Workbook();
  
      this.logger.log('Criando planilha de dados dos usuários');
      await this.userDataGenerator.generate(workbook, { users });
  
      this.logger.log('Criando planilha geral com médias por grupo');
      await this.generalWorksheetGenerator.generate(workbook, { 
        users,
        scoreService: this.scoreService 
      });

      this.logger.log('Criando planilhas específicas para cada filial');
      for (const filial of filiais) {
        this.logger.log(`Processando filial: ${filial.filial}`);
        await this.filialWorksheetGenerator.generate(workbook, {
          users,
          filial,
          scoreService: this.scoreService
        });
      }

      this.logger.log('Criando planilha de médias gerais por filial');
      await this.filialAveragesWorksheetGenerator.generate(workbook, {
        users,
        filiais,
        scoreService: this.scoreService
      });
      
      this.logger.log('Criando planilha de resultados');
      await this.resultsWorksheetGenerator.generate(workbook, { 
        users,
        scoreService: this.scoreService 
      });
      
      this.logger.log('Criando planilha de informações adicionais');
      await this.additionalInfoGenerator.generate(workbook, { users });
      
      this.logger.log('Criando planilha de respostas');
      await this.responsesWorksheetGenerator.generate(workbook, { 
        users,
        prisma: this.prisma 
      });
      
      this.logger.log('Configurando download do Excel');
      await this.excelBaseService.configureExcelDownload(res, `TabelaResultados_${company.name}.xlsx`, workbook);
      
      this.logger.log('Excel gerado com sucesso');
    } catch (error) {
      this.logger.error(`Erro ao gerar Excel: ${error.message}`);
      throw error;
    }
  }
}