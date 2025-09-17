import { PrismaClient } from '@prisma/client';
import seedAdmin from './seeds/admin.seed';
import seedQuestions from './seeds/questions.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');
  
  await seedAdmin();
  await seedQuestions();
  
  console.log('✅ Seeds finalizadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });