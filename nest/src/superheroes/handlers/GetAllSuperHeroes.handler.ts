import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSuperHeroesQuery } from '../queries';
import { RedisService } from '@/redis/redis.service';
import { CACHE_TTL } from '@/data/ttl';
import { PAGINATION_LIMIT } from '@/data/defaultVariables';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetAllSuperHeroesQuery)
export class GetAllSuperHeroesHandler implements IQueryHandler<GetAllSuperHeroesQuery> {
  ///  private readonly logger = new Logger(FindAllMoviesHandler.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepos: SuperHeroesRepository,
  ) {}

  async execute(query: GetAllSuperHeroesQuery) {
    const { offset = 0, page = 1 } = query;

    try {
      const cacheKey = `superhero:page:${page}:offset:${offset}`;
      const superCached = await this.redisService.getDataMultiple(cacheKey);
      if (superCached) {
        return superCached;
      }

      const result = await this.superHeroRepos.findMany({
        skip: offset,
        take: PAGINATION_LIMIT,
      });

      if (result.length === 0) {
        throw new NotFoundException('No Superheroes Exist');
      }
      await this.redisService.saveItemsMultiple(
        cacheKey,
        result,
        CACHE_TTL.ONE_MINUTE,
      );

      return result;
    } catch (error: unknown) {
      //  console.error('FindAllMoviesHandler error q:', error);

      if (error instanceof Error) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      throw new BadRequestException('Unknown error occurred');
    }
  }
}
