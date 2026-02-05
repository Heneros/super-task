/*
  Warnings:

  - You are about to drop the column `superId` on the `Images` table. All the data in the column will be lost.
  - Added the required column `superHeroId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_id_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "superId",
ADD COLUMN     "superHeroId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_superHeroId_fkey" FOREIGN KEY ("superHeroId") REFERENCES "SuperHero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
