import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';

const prisma = new PrismaClient();

async function generateUsers(
  quantity: number,
  companyId: number,
  filialId: number,
  batchSize = 1000,
) {
  console.time('Geração de usuários');

  const funcoes = ['Conselho', 'Diretor', 'Equipe', 'Gerente'];
  const generos = ['Masculino', 'Feminino'];

  let created = 0;
  const totalBatches = Math.ceil(quantity / batchSize);

  for (let batch = 0; batch < totalBatches; batch++) {
    const currentBatchSize = Math.min(batchSize, quantity - batch * batchSize);
    console.log(
      `Processando lote ${batch + 1}/${totalBatches}: ${currentBatchSize} usuários`,
    );

    const users = [];

    for (let i = 0; i < currentBatchSize; i++) {
      const dataAdmissao = faker.date.past({ years: 10 });

      users.push({
        nome: faker.person.fullName(),
        cidade: faker.location.city(),
        funcaoMacro: faker.helpers.arrayElement(funcoes),
        dataAdmissao,
        genero: faker.helpers.arrayElement(generos),
        filialId,
        companyId,
        respondeuForm: faker.datatype.boolean(),
        dynamicResponses: {
          dataNascimento: faker.date
            .birthdate({ min: 18, max: 65, mode: 'age' })
            .toISOString(),
          estado: faker.location.state(),
          pais: 'Brasil',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await prisma.users.createMany({
      data: users,
    });

    created += currentBatchSize;
  }

  console.timeEnd('Geração de usuários');
  return created;
}

async function main() {
  const args = process.argv.slice(2);
  const quantity = parseInt(args[0] || '1000', 10);
  const companyId = parseInt(args[1] || '1', 10);
  const filialId = parseInt(args[2] || '1', 10);

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    const filial = await prisma.filial.findUnique({ where: { id: filialId } });

    if (!company) {
      throw new Error(`Empresa com ID ${companyId} não encontrada.`);
    }

    if (!filial) {
      throw new Error(`Filial com ID ${filialId} não encontrada.`);
    }

    console.log(
      `Gerando ${quantity} usuários para a empresa "${company.name}", filial ID ${filialId}...`,
    );

    const created = await generateUsers(quantity, companyId, filialId);
    console.log(`✅ ${created} usuários criados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
