-- CreateTable
CREATE TABLE "SuperHero" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "origin_description" TEXT NOT NULL,
    "superpowers" TEXT[],
    "catch_phrase" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_imageId_key" ON "Images"("imageId");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "SuperHero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
