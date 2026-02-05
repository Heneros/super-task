/*
  Warnings:

  - Added the required column `movieId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_imageId_fkey";

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "movieId" INTEGER NOT NULL,
ALTER COLUMN "imageId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_id_fkey" FOREIGN KEY ("id") REFERENCES "SuperHero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
