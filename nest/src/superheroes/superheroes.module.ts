import { Module } from '@nestjs/common';

import * as Handlers from './handlers/index';
import { RedisModule } from '@/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@/prisma/prisma.module';
import { SuperheroesController } from './superheroes.controller';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SuperHeroesRepository } from './repository/SuperHeroes.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule, CqrsModule, RedisModule],
  controllers: [SuperheroesController],
  providers: [
    ...Object.values(Handlers),
    RedisService,
    PrismaService,
    CloudinaryService,
    SuperHeroesRepository,
  ],
})
export class SuperheroesModule {}
