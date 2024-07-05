-- CreateTable
CREATE TABLE "Filial" (
    "id" SERIAL NOT NULL,
    "filial" TEXT NOT NULL,
    "quantidadeColaboradores" INTEGER NOT NULL,

    CONSTRAINT "Filial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormVisibility" (
    "id" SERIAL NOT NULL,
    "field" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL,

    CONSTRAINT "FormVisibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" TEXT,
    "dataNascimento" TIMESTAMP(3),
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

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "question" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "FormVisibility_field_key" ON "FormVisibility"("field");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "UserResponse_userId_question_key" ON "UserResponse"("userId", "question");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponse" ADD CONSTRAINT "UserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
