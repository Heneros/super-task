import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { SuperHeroesRepository } from '@/superheroes/repository/SuperHeroes.repository';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [PrismaModule],
  providers: [CloudinaryProvider, PrismaService, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService, PrismaService],
})
export class CloudinaryModule {}
 