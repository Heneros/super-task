import { Module } from '@nestjs/common';

import * as Handlers from './handlers/index';
import { RedisModule } from '@/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@/prisma/prisma.module';
import { SuperheroesController } from './superheroes.controller';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SuperHeroesRepository } from './repository/SuperHeroes.repository';

@Module({
  imports: [PrismaModule, CqrsModule, RedisModule],
  controllers: [SuperheroesController],
  providers: [
    ...Object.values(Handlers),
    RedisService,
    PrismaService,
    SuperHeroesRepository,
  ],
})
export class SuperheroesModule {}
