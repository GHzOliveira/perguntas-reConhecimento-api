-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCompleto" TEXT,
    "dataNascimento" DATETIME,
    "email" TEXT,
    "cpf" TEXT,
    "tempoEmpresa" INTEGER,
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

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");
