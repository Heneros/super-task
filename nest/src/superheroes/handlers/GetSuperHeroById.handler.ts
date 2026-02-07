import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIdSuperHeroQuery } from '../queries/index';
import {
  BadRequestException,
  HttpExceptionOptions,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(GetIdSuperHeroQuery)
export class GetSuperHeroById implements IQueryHandler<GetIdSuperHeroQuery> {
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepository: SuperHeroesRepository,
  ) {}

  async execute(query: GetIdSuperHeroQuery) {
    const { superHeroId } = query;
console.log('Executing GetSuperHeroById with ID:', superHeroId);
    try {
      const superKey = `superhero:id:${superHeroId}`;
      
      const superHeroCached = await this.redisService.getDataMultiple(
      superKey
      );
      if (superHeroCached) {
        console.log('Cache hit for SuperHero ID:', superHeroCached);
        return superHeroCached
      }

      const superIdResult = await this.superHeroRepository.findUnique({
        id: superHeroId,
      });
      if (!superIdResult) {
        throw new NotFoundException(
          `SuperHero don\'t exist', ${superIdResult}`,
        );
      }

      await this.redisService.saveDataItem(String(superHeroId), superIdResult    ,  CACHE_TTL.ONE_MINUTE,);
      return superIdResult;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid data format', { cause: error });
    }
  }
}
