import { Controller, Get, Param, Res, ParseIntPipe, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CalculoService } from 'src/services/calculo/calculo.service';
import { ScoreService } from 'src/services/calculo/score.service';

interface ScoreResponse {
  success: boolean;
  data: any;
  message: string;
}

@ApiTags('Cálculos')
@Controller('calculo')
export class CalculoController {
  private readonly logger = new Logger(CalculoController.name);

  constructor(
    private readonly calculoService: CalculoService,
    private readonly scoreService: ScoreService
  ) {}

  @Get('group-score/:userId')
  @ApiOperation({ summary: 'Calcular pontuação do grupo para um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Pontuações calculadas com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async calcularPontuacaoGrupo(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<ScoreResponse> {
    try {
      this.logger.log(`Calculando pontuações para o usuário ID: ${userId}`);
      const result = await this.scoreService.calculateGroupScores(userId);
      
      return {
        success: true,
        data: result,
        message: 'Pontuações do grupo calculadas com sucesso'
      };
    } catch (error) {
      this.logger.error(`Erro ao calcular pontuações: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erro ao calcular pontuações do grupo');
    }
  }

  @Get('group-score-excel/:userId')
  @ApiOperation({ summary: 'Gerar Excel com pontuações individuais do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Excel gerado com sucesso', 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async gerarExcelPontuacaoIndividual(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Gerando Excel com pontuações individuais para o usuário ID: ${userId}`);
      await this.calculoService.generateExcelUserIndividualScores(userId, res);
    } catch (error) {
      this.logger.error(`Erro ao gerar Excel individual: ${error.message}`);
      throw new NotFoundException('Erro ao gerar Excel de pontuações individuais');
    }
  }

  @Get('calculate-and-generate-excel/:userId')
  @ApiOperation({ summary: 'Calcular e gerar Excel com resultados do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Excel calculado e gerado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async calcularEGerarExcel(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Calculando e gerando Excel para o usuário ID: ${userId}`);
      await this.calculoService.calculateAndGenerateExcel(userId, res);
    } catch (error) {
      this.logger.error(`Erro ao calcular e gerar Excel: ${error.message}`);
      throw new NotFoundException('Erro ao calcular e gerar Excel');
    }
  }

  @Get('generate-excel/:companyId')
  @ApiOperation({ summary: 'Gerar Excel com resultados dos usuários de uma empresa específica' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Excel gerado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa não encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Erro ao gerar o Excel' 
  })
  async gerarExcelResultadosUsuarios(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Res() res: Response
  ): Promise<void> {
    try {
      this.logger.log(`Gerando Excel com resultados de usuários da empresa ID: ${companyId}`);
      await this.calculoService.generateExcelWithUserResults(companyId, res);
    } catch (error) {
      this.logger.error(`Erro ao gerar Excel com resultados: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erro ao gerar Excel com resultados dos usuários');
    }
  }
}