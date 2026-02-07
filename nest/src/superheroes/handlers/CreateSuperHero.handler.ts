import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data';
import { RedisService } from '@/redis/redis.service';
import { CreateSuperHeroCommand } from '../commands';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';

@CommandHandler(CreateSuperHeroCommand)
export class CreateSuperHeroHandler implements ICommandHandler<CreateSuperHeroCommand> {
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepository: SuperHeroesRepository,
  ) {}

  async execute(command: CreateSuperHeroCommand) {
    const { createSuperHeroDto } = command;

    try {
      const superItem = await this.superHeroRepository.findUnique({
        nickname: createSuperHeroDto.nickname,
      });

      if (superItem) {
        throw new BadRequestException(
          'SuperHero already exists with this nickname. ',
        );
      }

      const superHero =
        await this.superHeroRepository.create(createSuperHeroDto);
      await this.redisService.saveDataItem(
        `${RedisPrefixEnum.SUPERHEROES_ID}-${superHero.id}`,
        superHero,
      );

      return superHero;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
     // console.error('Error creating SuperHero:', error);
      throw new ConflictException(
        'Could not create SuperHero at the moment. Please try again later.',
      );
    }
  }
}
