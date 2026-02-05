import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIdSuperHeroQuery } from '../queries/index';
import {
  BadRequestException,
  HttpExceptionOptions,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';

@QueryHandler(GetIdSuperHeroQuery)
export class GetSuperHeroById implements IQueryHandler<GetIdSuperHeroQuery> {
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepository: SuperHeroesRepository,
  ) {}

  async execute(query: GetIdSuperHeroQuery) {
    const { superHeroId } = query;

    try {
      //       const movieKey = `movie:id:${movieId}`;
      const movieCached = await this.redisService.getDataMultiple(
        String(superHeroId),
      );
      if (movieCached) {
        return JSON.parse(movieCached);
      }

      const superIdResult = await this.superHeroRepository.findUnique({
        id: superHeroId,
      });
      if (!superIdResult) {
        throw new NotFoundException(
          `SuperHero don\'t exist', ${superIdResult}`,
        );
      }

      await this.redisService.saveDataItem(String(superHeroId), superIdResult);
      return superIdResult;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid data format', { cause: error });
    }
  }
}
