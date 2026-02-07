import { CreateSuperHeroHandler } from '../CreateSuperHero.handler';
import { CreateSuperHeroCommand } from '../../commands';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { RedisPrefixEnum } from '@/data';

describe('CreateSuperHeroHandler', () => {
  let handler: CreateSuperHeroHandler;

  let superHeroRepository: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };

  let redisService: {
    saveDataItem: jest.Mock;
  };

  const superHeroDto = {
    nickname: 'Batman',
    origin_description: 'Gotham',
    superpowers: ['Money', 'Intelligence'],
    catch_phrase: 'I am Batman',
  };

  beforeEach(() => {
    superHeroRepository = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };

    redisService = {
      saveDataItem: jest.fn(),
    };

    handler = new CreateSuperHeroHandler(
      redisService as unknown as RedisService,
      superHeroRepository as any,
    );
  });

  it('should create a superhero successfully', async () => {
    superHeroRepository.findUnique.mockResolvedValue(null);

    const createdHero = { id: 1, ...superHeroDto };
    superHeroRepository.create.mockResolvedValue(createdHero);

    const result = await handler.execute(
      new CreateSuperHeroCommand(superHeroDto),
    );

    expect(superHeroRepository.findUnique).toHaveBeenCalledWith({
      nickname: superHeroDto.nickname,
    });

    expect(superHeroRepository.create).toHaveBeenCalledWith(superHeroDto);

    expect(redisService.saveDataItem).toHaveBeenCalledWith(
      `${RedisPrefixEnum.SUPERHEROES_ID}-${createdHero.id}`,
      createdHero,
    );

    expect(result).toEqual(createdHero);
  });

  it('should throw BadRequestException if superhero with nickname already exists', async () => {
    superHeroRepository.findUnique.mockResolvedValue(superHeroDto);

    const command = new CreateSuperHeroCommand(superHeroDto);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(superHeroRepository.create).not.toHaveBeenCalled();
    expect(redisService.saveDataItem).not.toHaveBeenCalled();
  });

  it('should throw ConflictException on unexpected error', async () => {
    superHeroRepository.findUnique.mockResolvedValue(null);
    superHeroRepository.create.mockRejectedValue(new Error('DB error'));

    const command = new CreateSuperHeroCommand(superHeroDto);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
