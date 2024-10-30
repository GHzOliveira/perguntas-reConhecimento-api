/*
  Warnings:

  - You are about to drop the column `ModeloTrabalho` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `PartGrupos` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `QuantidadeLivros` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `TempoCasaTrab` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "ModeloTrabalho",
DROP COLUMN "PartGrupos",
DROP COLUMN "QuantidadeLivros",
DROP COLUMN "TempoCasaTrab",
ADD COLUMN     "modeloTrabalho" TEXT,
ADD COLUMN     "partGrupos" TEXT,
ADD COLUMN     "quantidadeLivros" INTEGER,
ADD COLUMN     "tempoCasaTrab" TEXT;
