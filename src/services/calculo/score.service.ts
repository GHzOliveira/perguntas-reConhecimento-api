import { Injectable, Logger } from '@nestjs/common';
import { GroupConfig } from 'src/interface/group-scores.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name);
  
  constructor(private readonly prisma: PrismaService) {}
  
  private readonly GROUPS_CONFIG: Record<string, GroupConfig> = {
    'modelo de liderança': {
        questionIds: [1, 7, 16, 4, 10, 13],
      },
      'propósito': {
        questionIds: [6, 9, 14, 2, 11, 17],
      },
      'valores': { questionIds: [3, 12, 18, 5, 8, 15]},
      'Estrutura Sistêmica': {
        questionIds: [19, 34, 28, 31],
      },
      'DF Intenção': { questionIds: [24, 27, 20, 29]},
      'DP Vocação': { questionIds: [21, 30, 32, 36] },
      'DC Conexão': { questionIds: [26, 35, 22, 38] },
      'DE Valoração': {
        questionIds: [25, 37, 23, 33],
      },
      'Roda do Aprendizado - Liderança educadora': {
        questionIds: [39, 50],
      },
      'Conversa de Valor - Qualidade de diálogo': {
        questionIds: [40, 51],
      },
      'Princípio da Linha d`água - Autonomia e autoridade': {
        questionIds: [41, 52],
      },
      'Experiência - Fidelização e engajamento': {
        questionIds: [53, 42],
      },
      'Ilha das Competências - Potencial da equipe': {
        questionIds: [54, 43],
      },
      'Operação Curiosidade - Comportamento empreendedor': {
        questionIds: [44, 55],
      },
      'Metaprojeto - Trabalho com significado': {
        questionIds: [45, 56],
      },
      'Metaprocesso - Eficácia operacional': {
        questionIds: [46, 57],
      },
      'Musa - Inovação e criatividade': {
        questionIds: [58, 47],
      },
      'Balanço das Riquezas - Resultados plenos': {
        questionIds: [59, 48],
      },
      'Planta de Serviços - Momentos da verdade': {
        questionIds: [49, 60],
      },
  };
  
  private readonly percentageReferences = {
    'modelo de liderança': 60,
    'propósito': 60,
    'valores': 60,
    'Estrutura Sistêmica': 40,
    'DF Intenção': 40,
    'DP Vocação': 40,
    'DC Conexão': 40,
    'DE Valoração': 40,
    'Roda do Aprendizado - Liderança educadora': 20,
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
  
  async calculateGroupScores(userId: number) {
    const responses = await this.prisma.userResponse.findMany({
      where: { userId: userId },
    });

    const result = {};

    for (const [groupName, config] of Object.entries(this.GROUPS_CONFIG)) {
      const totalScore = responses
        .filter((response) => config.questionIds.includes(response.question))
        .reduce((sum, response) => sum + response.score, 0);
  
      const percentageReference = this.percentageReferences[groupName];
      result[groupName] = ((totalScore / percentageReference) * 100).toFixed(1);
    }
  
    return result;
  }
  
  async calculateAverageGroupScores(users: any[], filter?: (user: any) => boolean): Promise<Record<string, string>> {
    const filteredUsers = filter ? users.filter(filter) : users;
    
    if (filteredUsers.length === 0) {
      return this.getGroupNames().reduce((acc, groupName) => {
        acc[groupName] = "0.0";
        return acc;
      }, {});
    }
    
    const allScores = await Promise.all(
      filteredUsers.map(user => this.calculateGroupScores(user.id))
    );
    
    const groupTotals: Record<string, number> = {};
    const groupCounts: Record<string, number> = {};
    
    for (const userScores of allScores) {
      for (const [groupName, score] of Object.entries(userScores)) {
        if (!groupTotals[groupName]) {
          groupTotals[groupName] = 0;
          groupCounts[groupName] = 0;
        }
        groupTotals[groupName] += parseFloat(score as string);
        groupCounts[groupName]++;
      }
    }
    
    const averages: Record<string, string> = {};
    for (const groupName of Object.keys(groupTotals)) {
      averages[groupName] = (groupTotals[groupName] / groupCounts[groupName]).toFixed(1);
    }
    
    return averages;
  }
  
  getGroupNames(): string[] {
    return Object.keys(this.GROUPS_CONFIG);
  }
  
  getAspectsDefinition() {
    return {
      FILOSOFIA: ['modelo de liderança', 'propósito', 'valores'],
      ESTRATEGIA: [
        'Estrutura Sistêmica',
        'DF Intenção',
        'DP Vocação',
        'DC Conexão',
        'DE Valoração',
      ],
      METODO: [
        'Roda do Aprendizado - Liderança educadora',
        'Conversa de Valor - Qualidade de diálogo',
        'Princípio da Linha d`água - Autonomia e autoridade',
        'Experiência - Fidelização e engajamento',
        'Ilha das Competências - Potencial da equipe',
        'Operação Curiosidade - Comportamento empreendedor',
        'Metaprojeto - Trabalho com significado',
        'Metaprocesso - Eficácia operacional',
        'Musa - Inovação e criatividade',
        'Balanço das Riquezas - Resultados plenos',
        'Planta de Serviços - Momentos da verdade',
      ],
    };
  }
}