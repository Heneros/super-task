/*
  Warnings:

  - You are about to drop the column `movieId` on the `Images` table. All the data in the column will be lost.
  - Added the required column `superId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "movieId",
ADD COLUMN     "superId" INTEGER NOT NULL;
