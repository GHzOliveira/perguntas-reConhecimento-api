-- CreateTable
CREATE TABLE "Filial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filial" TEXT NOT NULL,
    "quantidadeColaboradores" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FormVisibility" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "field" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "FormVisibility_field_key" ON "FormVisibility"("field");
