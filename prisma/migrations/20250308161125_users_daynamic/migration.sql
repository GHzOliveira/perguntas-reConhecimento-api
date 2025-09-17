/*
  Warnings:

  - You are about to drop the column `areaTrabalho` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `dataNascimento` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `educacaoMetanoia` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `escolaridade` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `estadoCivil` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `filhos` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `funcao` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `genero` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `hobbie` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `modeloTrabalho` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `nomeCompleto` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `pais` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `partGrupos` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeLivros` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `tempoCasaTrab` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `tempoEmpresa` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "areaTrabalho",
DROP COLUMN "cidade",
DROP COLUMN "cpf",
DROP COLUMN "dataNascimento",
DROP COLUMN "educacaoMetanoia",
DROP COLUMN "escolaridade",
DROP COLUMN "estado",
DROP COLUMN "estadoCivil",
DROP COLUMN "filhos",
DROP COLUMN "funcao",
DROP COLUMN "genero",
DROP COLUMN "hobbie",
DROP COLUMN "modeloTrabalho",
DROP COLUMN "nomeCompleto",
DROP COLUMN "pais",
DROP COLUMN "partGrupos",
DROP COLUMN "quantidadeLivros",
DROP COLUMN "tempoCasaTrab",
DROP COLUMN "tempoEmpresa",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dynamicResponses" JSONB,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
