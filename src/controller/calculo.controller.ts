import { Controller, Get, Param, Res, ParseIntPipe, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { CalculoService } from 'src/services/calculo.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

interface ScoreResponse {
  success: boolean;
  data: any;
  message: string;
}

@ApiTags('Cálculos')
@Controller('calculo')
export class CalculoController {
  constructor(private readonly calculoService: CalculoService) {}

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
      const result = await this.calculoService.calculateGroupScores(userId);
      return {
        success: true,
        data: result,
        message: 'Pontuações do grupo calculadas com sucesso'
      };
    } catch (error) {
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
      await this.calculoService.generateExcelUserIndividualScores(userId, res);
    } catch (error) {
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
      await this.calculoService.calculateAndGenerateExcel(userId, res);
    } catch (error) {
      throw new NotFoundException('Erro ao calcular e gerar Excel');
    }
  }

  @Get('generate-excel')
  @ApiOperation({ summary: 'Gerar Excel com resultados de todos os usuários' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Excel gerado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Erro ao gerar o Excel' 
  })
  async gerarExcelResultadosUsuarios(
    @Res() res: Response
  ): Promise<void> {
    try {
      await this.calculoService.generateExcelWithUserResults(res);
    } catch (error) {
      throw new NotFoundException('Erro ao gerar Excel com resultados dos usuários');
    }
  }
}