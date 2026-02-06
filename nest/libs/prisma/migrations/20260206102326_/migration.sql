/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Images_publicId_key" ON "Images"("publicId");
