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

      const [data, total] = await this.superHeroRepos.findAllHeroes(offset);

      if (data.length === 0) {
        throw new NotFoundException('No Superheroes Exist');
      }

const goodResult = data
  .map(({ images, ...hero }) => ({
    ...hero,
    mainImage: images?.[0]?.posterUrl || null,
  }));

    // const formattedResult = result.map(hero => ({
    //     ...hero,
    //     mainImage: hero.images?.[0] || null, 
    //   }));
  const res = { data: goodResult, total };
      await this.redisService.saveItemsMultiple(
        cacheKey,
        res,
        CACHE_TTL.ONE_MINUTE,
      );

      return res;
    } catch (error: unknown) {
      //  console.error('FindAllMoviesHandler error q:', error);

      if (error instanceof Error) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      throw new BadRequestException('Unknown error occurred');
    }
  }
}
