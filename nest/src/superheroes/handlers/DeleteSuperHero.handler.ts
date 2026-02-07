import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data';
import { RedisService } from '@/redis/redis.service';
import { DeleteSuperHeroCommand } from '../commands';
import { SuperHeroesRepository } from '../repository/SuperHeroes.repository';

@CommandHandler(DeleteSuperHeroCommand)
export class DeleteSuperHeroHandler implements ICommandHandler<DeleteSuperHeroCommand> {
  constructor(
    private readonly redisService: RedisService,
    private readonly superHeroRepository: SuperHeroesRepository,
  ) {}

  async execute(command: DeleteSuperHeroCommand) {
    const { superId } = command;

    try {
      const superHero = await this.superHeroRepository.findUnique({
        id: superId,
      });



      await this.superHeroRepository.delete({ id: superId });

      await this.redisService.deleteItemCache(
        RedisPrefixEnum.SUPERHEROES_ID,
        superId,
      );

      return superHero;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error deleting SuperHero:', error);
      throw new ConflictException(
        'Could not create SuperHero at the moment. Please try again later.',
      );
    }
  }
}
