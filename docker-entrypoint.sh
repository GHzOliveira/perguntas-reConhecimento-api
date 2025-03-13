#!/bin/sh

# Aguarda o banco de dados estar disponível
echo "Aguardando o banco de dados..."
sleep 5

# Executa as migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

# Executa o seed
echo "Executando o seed..."
npm run seed

# Inicia a aplicação
echo "Iniciando a aplicação..."
node dist/main.js