import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  const adminExists = await prisma.admin.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin@123456', 10);
    
    await prisma.admin.create({
      data: {
        login: 'admin@admin.com',
        senha: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin inicial criado com sucesso');
  } else {
    console.log('ℹ️ Admin já existe, pulando seed');
  }
}

export default seedAdmin;