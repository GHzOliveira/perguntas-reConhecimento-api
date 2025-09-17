/*
  Warnings:

  - You are about to drop the `FormVisibility` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Filial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkUnico` to the `Filial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Filial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `filialId` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_filialId_fkey";

-- AlterTable
ALTER TABLE "Filial" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "linkUnico" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "companyId" INTEGER NOT NULL,
ALTER COLUMN "filialId" SET NOT NULL;

-- DropTable
DROP TABLE "FormVisibility";

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormBuilder" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL,

    CONSTRAINT "FormBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicForm" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "formData" JSONB NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Formulário sem nome',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DynamicForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FormBuilder_companyId_field_key" ON "FormBuilder"("companyId", "field");

-- CreateIndex
CREATE INDEX "Filial_companyId_status_idx" ON "Filial"("companyId", "status");

-- AddForeignKey
ALTER TABLE "Filial" ADD CONSTRAINT "Filial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBuilder" ADD CONSTRAINT "FormBuilder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicForm" ADD CONSTRAINT "DynamicForm_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
