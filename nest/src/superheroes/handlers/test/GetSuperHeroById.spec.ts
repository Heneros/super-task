import { GetSuperHeroById } from '../GetSuperHeroById.handler';
import { GetIdSuperHeroQuery } from '../../queries';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { CACHE_TTL } from '@/data/ttl';

describe('GetSuperHeroById', () => {
  let handler: GetSuperHeroById;

  let redisService: {
    getDataMultiple: jest.Mock;
    saveDataItem: jest.Mock;
  };

  let superHeroRepository: {
    findUnique: jest.Mock;
  };

  const superHero = {
    id: 1,
    nickname: 'Batman',
    origin_description: 'Gotham',
    superpowers: ['Money'],
    catch_phrase: 'I am Batman',
  };

  beforeEach(() => {
    redisService = {
      getDataMultiple: jest.fn(),
      saveDataItem: jest.fn(),
    };

    superHeroRepository = {
      findUnique: jest.fn(),
    };

    handler = new GetSuperHeroById(
      redisService as unknown as RedisService,
      superHeroRepository as any,
    );
  });

  it('should return superhero from cache if exists', async () => {
    redisService.getDataMultiple.mockResolvedValue(superHero);

    const result = await handler.execute(new GetIdSuperHeroQuery(superHero.id));

    expect(redisService.getDataMultiple).toHaveBeenCalledWith(
      `superhero:id:${superHero.id}`,
    );

    expect(superHeroRepository.findUnique).not.toHaveBeenCalled();
    expect(result).toEqual(superHero);
  });

  it('should return superhero from repository and save to cache', async () => {
    redisService.getDataMultiple.mockResolvedValue(null);
    superHeroRepository.findUnique.mockResolvedValue(superHero);

    const result = await handler.execute(new GetIdSuperHeroQuery(superHero.id));

    expect(superHeroRepository.findUnique).toHaveBeenCalledWith({
      id: superHero.id,
    });

    expect(redisService.saveDataItem).toHaveBeenCalledWith(
      String(superHero.id),
      superHero,
      CACHE_TTL.ONE_MINUTE,
    );

    expect(result).toEqual(superHero);
  });

  it('should throw NotFoundException if superhero does not exist', async () => {
    redisService.getDataMultiple.mockResolvedValue(null);
    superHeroRepository.findUnique.mockResolvedValue(null);

    const query = new GetIdSuperHeroQuery(999);

    await expect(handler.execute(query)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(redisService.saveDataItem).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException on repository error', async () => {
    redisService.getDataMultiple.mockResolvedValue(null);
    superHeroRepository.findUnique.mockRejectedValue(new Error('DB error'));

    const query = new GetIdSuperHeroQuery(1);

    await expect(handler.execute(query)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
