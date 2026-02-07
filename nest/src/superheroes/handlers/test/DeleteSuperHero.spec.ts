import { DeleteSuperHeroHandler } from '../DeleteSuperHero.handler';
import { DeleteSuperHeroCommand } from '../../commands';
import { ConflictException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { RedisPrefixEnum } from '@/data';

describe('DeleteSuperHeroHandler', () => {
  let handler: DeleteSuperHeroHandler;

  let superHeroRepository: {
    findUnique: jest.Mock;
    delete: jest.Mock;
  };

  let redisService: {
    deleteItemCache: jest.Mock;
    flushAll: jest.Mock;
  };

  const superHero = {
    id: 1,
    nickname: 'Batman',
    origin_description: 'Gotham',
    superpowers: ['Money'],
    catch_phrase: 'I am Batman',
  };

  beforeEach(() => {
    superHeroRepository = {
      findUnique: jest.fn(),
      delete: jest.fn(),
    };

    redisService = {
      deleteItemCache: jest.fn(),
      flushAll: jest.fn(),
    };

    handler = new DeleteSuperHeroHandler(
      redisService as unknown as RedisService,
      superHeroRepository as any,
    );
  });

  it('should delete superhero successfully', async () => {
    superHeroRepository.findUnique.mockResolvedValue(superHero);
    superHeroRepository.delete.mockResolvedValue(superHero);

    const result = await handler.execute(
      new DeleteSuperHeroCommand(superHero.id),
    );

    expect(superHeroRepository.findUnique).toHaveBeenCalledWith({
      id: superHero.id,
    });

    expect(superHeroRepository.delete).toHaveBeenCalledWith({
      id: superHero.id,
    });

    expect(redisService.deleteItemCache).toHaveBeenCalledWith(
      RedisPrefixEnum.SUPERHEROES_ID,
      superHero.id,
    );

    expect(redisService.flushAll).toHaveBeenCalledTimes(1);

    expect(result).toEqual(superHero);
  });

  it('should throw ConflictException on repository error', async () => {
    superHeroRepository.findUnique.mockRejectedValue(new Error('DB error'));

    const command = new DeleteSuperHeroCommand(1);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(superHeroRepository.delete).not.toHaveBeenCalled();
    expect(redisService.deleteItemCache).not.toHaveBeenCalled();
    expect(redisService.flushAll).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
