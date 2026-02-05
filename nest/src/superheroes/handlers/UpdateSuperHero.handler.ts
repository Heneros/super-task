import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data';
import { RedisService } from '@/redis/redis.service';
import crypto from 'crypto';
import { CreateSuperHeroCommand, UpdateSuperHeroCommand } from '../commands';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';

@CommandHandler(UpdateSuperHeroCommand)
export class UpdateSuperHeroHandler implements ICommandHandler<UpdateSuperHeroCommand> {
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepository: SuperHeroesRepository,
  ) {}

  async execute(command: UpdateSuperHeroCommand) {
    const { superId, updateSuperHeroDto } = command;

    try {
      const superHero = await this.superHeroRepository.update(
        { id: superId },
        updateSuperHeroDto,
      );
      await this.redisService.saveDataItem(
        `${RedisPrefixEnum.SUPERHEROES_ID}-${superHero.id}`,
        superHero,
      );
      return superHero;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating SuperHero:', error);
      throw new ConflictException(
        'Could not update SuperHero at the moment. Please try again later.',
      );
    }
  }
}
