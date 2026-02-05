/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `SuperHero` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SuperHero_nickname_key" ON "SuperHero"("nickname");
