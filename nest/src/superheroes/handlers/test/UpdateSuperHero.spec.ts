import { UpdateSuperHeroHandler } from '../UpdateSuperHero.handler';
import { UpdateSuperHeroCommand } from '../../commands';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { RedisPrefixEnum } from '@/data';

describe('UpdateSuperHeroHandler', () => {
  let handler: UpdateSuperHeroHandler;

  let superHeroRepository: {
    update: jest.Mock;
  };

  let redisService: {
    saveDataItem: jest.Mock;
  };

  const superId = 1;

  const updateDto = {
    nickname: 'Batman Updated',
    origin_description: 'New Gotham',
    superpowers: ['Money', 'Tech'],
    catch_phrase: 'I am vengeance',
  };

  const updatedHero = {
    id: superId,
    ...updateDto,
  };

  beforeEach(() => {
    superHeroRepository = {
      update: jest.fn(),
    };

    redisService = {
      saveDataItem: jest.fn(),
    };

    handler = new UpdateSuperHeroHandler(
      redisService as unknown as RedisService,
      superHeroRepository as any,
    );
  });

  it('should update superhero successfully and save to redis', async () => {
    superHeroRepository.update.mockResolvedValue(updatedHero);

    const result = await handler.execute(
      new UpdateSuperHeroCommand(superId, updateDto),
    );

    expect(superHeroRepository.update).toHaveBeenCalledWith(
      { id: superId },
      updateDto,
    );

    expect(redisService.saveDataItem).toHaveBeenCalledWith(
      `${RedisPrefixEnum.SUPERHEROES_ID}-${updatedHero.id}`,
      updatedHero,
    );

    expect(result).toEqual(updatedHero);
  });

  it('should throw BadRequestException if repository throws it', async () => {
    superHeroRepository.update.mockRejectedValue(
      new BadRequestException('Invalid data'),
    );

    const command = new UpdateSuperHeroCommand(superId, updateDto);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(redisService.saveDataItem).not.toHaveBeenCalled();
  });

  it('should throw ConflictException on unexpected error', async () => {
    superHeroRepository.update.mockRejectedValue(new Error('DB error'));

    const command = new UpdateSuperHeroCommand(superId, updateDto);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(redisService.saveDataItem).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
