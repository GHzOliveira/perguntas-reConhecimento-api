/*
  Warnings:

  - You are about to drop the column `email` on the `Users` table. All the data in the column will be lost.
  - Added the required column `cidade` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAdmissao` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funcaoMacro` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genero` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "email",
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "dataAdmissao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "funcaoMacro" TEXT NOT NULL,
ADD COLUMN     "genero" TEXT NOT NULL;
