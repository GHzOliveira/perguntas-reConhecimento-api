-- CreateTable
CREATE TABLE "UserResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "question" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "UserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserResponse_userId_question_key" ON "UserResponse"("userId", "question");
