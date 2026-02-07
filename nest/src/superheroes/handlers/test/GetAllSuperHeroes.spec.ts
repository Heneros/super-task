import { GetAllSuperHeroesHandler } from '../GetAllSuperHeroes.handler';
import { GetAllSuperHeroesQuery } from '../../queries';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { CACHE_TTL } from '@/data/ttl';

describe('GetAllSuperHeroesHandler', () => {
  let handler: GetAllSuperHeroesHandler;

  let redisService: {
    getDataMultiple: jest.Mock;
    saveItemsMultiple: jest.Mock;
  };

  let superHeroRepos: {
    findAllHeroes: jest.Mock;
  };

  const heroesFromDb = [
    {
      id: 1,
      nickname: 'Batman',
      origin_description: 'Gotham',
      catch_phrase: 'I am Batman',
      images: [{ posterUrl: 'img1.jpg' }],
    },
    {
      id: 2,
      nickname: 'Superman',
      origin_description: 'Krypton',
      catch_phrase: 'Up in the sky',
      images: [],
    },
  ];

  beforeEach(() => {
    redisService = {
      getDataMultiple: jest.fn(),
      saveItemsMultiple: jest.fn(),
    };

    superHeroRepos = {
      findAllHeroes: jest.fn(),
    };

    handler = new GetAllSuperHeroesHandler(
      redisService as unknown as RedisService,
      superHeroRepos as any,
    );
  });

  it('should return data from cache if exists', async () => {
    const cachedResult = {
      data: [{ id: 1, nickname: 'CachedHero', mainImage: null }],
      total: 1,
    };

    redisService.getDataMultiple.mockResolvedValue(cachedResult);

    const result = await handler.execute(new GetAllSuperHeroesQuery(0, 1));

    expect(redisService.getDataMultiple).toHaveBeenCalledWith(
      'superhero:page:1:offset:0',
    );

    expect(superHeroRepos.findAllHeroes).not.toHaveBeenCalled();
    expect(result).toEqual(cachedResult);
  });

  it('should return heroes with mainImage mapped and save to cache', async () => {
    redisService.getDataMultiple.mockResolvedValue(null);
    superHeroRepos.findAllHeroes.mockResolvedValue([heroesFromDb, 2]);

    const result = await handler.execute(new GetAllSuperHeroesQuery(0, 1));

    expect(superHeroRepos.findAllHeroes).toHaveBeenCalledWith(0);

    expect(result).toEqual({
      data: [
        {
          id: 1,
          nickname: 'Batman',
          origin_description: 'Gotham',
          catch_phrase: 'I am Batman',
          mainImage: 'img1.jpg',
        },
        {
          id: 2,
          nickname: 'Superman',
          origin_description: 'Krypton',
          catch_phrase: 'Up in the sky',
          mainImage: null,
        },
      ],
      total: 2,
    });

    expect(redisService.saveItemsMultiple).toHaveBeenCalledWith(
      'superhero:page:1:offset:0',
      result,
      CACHE_TTL.ONE_MINUTE,
    );
  });



  it('should throw BadRequestException on repository error', async () => {
    redisService.getDataMultiple.mockResolvedValue(null);
    superHeroRepos.findAllHeroes.mockRejectedValue(new Error('DB error'));

    const query = new GetAllSuperHeroesQuery(0, 1);

    await expect(handler.execute(query)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
