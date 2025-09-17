# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração para instalar dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências, incluindo o Prisma
RUN npm ci

# Copia o restante do código
COPY . .

# Compila a aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

# Cria um usuário não-root para rodar a aplicação
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copia apenas os arquivos necessários para produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Define variáveis de ambiente
ENV NODE_ENV=production

# Gera o cliente Prisma
RUN npx prisma generate

# Muda para o usuário não-root
USER appuser

# Expõe a porta da aplicação
EXPOSE 3000

# Script de inicialização que espera o banco estar pronto, executa as migrações e o seed
COPY --from=builder --chown=appuser:appgroup /app/docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]