-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_superHeroId_fkey";

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_superHeroId_fkey" FOREIGN KEY ("superHeroId") REFERENCES "SuperHero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
