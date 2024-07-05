-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCompleto" TEXT,
    "dataNascimento" DATETIME,
    "email" TEXT,
    "cpf" TEXT,
    "tempoEmpresa" TEXT,
    "areaTrabalho" TEXT,
    "filialId" INTEGER,
    "funcao" TEXT,
    "genero" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT,
    "educacaoMetanoia" BOOLEAN DEFAULT false,
    CONSTRAINT "Users_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Users" ("areaTrabalho", "cidade", "cpf", "dataNascimento", "educacaoMetanoia", "email", "estado", "filialId", "funcao", "genero", "id", "nomeCompleto", "pais", "tempoEmpresa") SELECT "areaTrabalho", "cidade", "cpf", "dataNascimento", "educacaoMetanoia", "email", "estado", "filialId", "funcao", "genero", "id", "nomeCompleto", "pais", "tempoEmpresa" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
