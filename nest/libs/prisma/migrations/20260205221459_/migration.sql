/*
  Warnings:

  - You are about to drop the column `imageId` on the `Images` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "imageId",
ADD COLUMN     "publicId" TEXT NOT NULL;
