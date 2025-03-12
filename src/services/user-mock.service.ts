import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserMockService {
  constructor(private readonly prisma: PrismaService) {}

  generateMockUser(companyId: number, filialId: number) {
    const funcoes = ['Equipe'];
    const generos = ['Masculino', 'Feminino'];
    const modelosTrabalho = ['Presencial', 'Híbrido', 'Remoto'];
    const estadosCivis = [
      'Solteiro(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viúvo(a)',
    ];

    const dataAdmissao = faker.date.past({ years: 10 });

    const hoje = new Date();
    const anosNaEmpresa = hoje.getFullYear() - dataAdmissao.getFullYear();
    let tempoEmpresa = 'Menos de 1 ano';
    if (anosNaEmpresa >= 10) tempoEmpresa = 'Mais de 10 anos';
    else if (anosNaEmpresa >= 5) tempoEmpresa = '5 a 10 anos';
    else if (anosNaEmpresa >= 1) tempoEmpresa = '1 a 3 anos';

    return {
      nome: faker.person.fullName(),
      cidade: faker.location.city(),
      funcaoMacro: faker.helpers.arrayElement(funcoes),
      dataAdmissao: dataAdmissao.toISOString().split('T')[0],
      genero: faker.helpers.arrayElement(generos),
      filialId,
      companyId,
      respondeuForm: true,
      dynamicResponses: {
        dataNascimento: faker.date
          .birthdate({ min: 18, max: 65, mode: 'age' })
          .toISOString()
          .split('T')[0],
        estadoCivil: faker.helpers.arrayElement(estadosCivis),
        pais: 'Brasil',
        estado: faker.location.state(),
        tempoEmpresa,
        modeloTrabalho: faker.helpers.arrayElement(modelosTrabalho),
      },
    };
  }

  generateRandomScore() {
    const possibleScores = [0, 2.5, 5, 7.5, 10];
    return faker.helpers.arrayElement(possibleScores);
  }

  async createMockUsers(quantity: number, companyId: number, filialId: number) {
    const mockUsers = Array.from({ length: quantity }, () =>
      this.generateMockUser(companyId, filialId),
    );
    const totalQuestions = 60;

    try {
      console.log(`Iniciando criação de ${quantity} usuários mockados...`);

      // Usar transações separadas para cada usuário para evitar reversão completa
      const createdUsers = [];

      for (const user of mockUsers) {
        try {
          // Primeiro criar o usuário
          const createdUser = await this.prisma.users.create({
            data: {
              ...user,
              dataAdmissao: new Date(user.dataAdmissao),
            },
          });

          createdUsers.push(createdUser);
          console.log(`Usuário criado com ID: ${createdUser.id}`);

          // Preparar as respostas para todas as questões
          const userResponses = [];
          for (let questionId = 1; questionId <= totalQuestions; questionId++) {
            // Definir pontuação seguindo o padrão especificado
            const score = this.generateRandomScore();

            userResponses.push({
              userId: createdUser.id,
              question: questionId,
              score: score,
            });
          }

          // Tentar criar as respostas em lotes menores para evitar timeout
          const batchSize = 20;
          for (let i = 0; i < userResponses.length; i += batchSize) {
            const batch = userResponses.slice(i, i + batchSize);
            await this.prisma.userResponse.createMany({
              data: batch,
              skipDuplicates: true,
            });
          }

          console.log(
            `✅ ${userResponses.length} respostas criadas para o usuário ${createdUser.id}`,
          );
        } catch (error) {
          console.error(`❌ Erro ao processar usuário: ${error.message}`);
          console.error(error);
        }
      }

      console.log(
        `Total de ${createdUsers.length} usuários criados com sucesso.`,
      );
      return createdUsers;
    } catch (error) {
      console.error(`❌ Erro geral: ${error.message}`);
      throw error;
    }
  }
}
