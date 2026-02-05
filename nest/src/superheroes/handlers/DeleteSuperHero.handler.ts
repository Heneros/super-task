import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data';
import { RedisService } from '@/redis/redis.service';
import { CreateSuperHeroCommand, DeleteSuperHeroCommand } from '../commands';
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
    

      const superHero =
        await this.superHeroRepository.findUnique({
          id: superId,
        });

      if (!superHero) {
        throw new BadRequestException('SuperHero not found');
      }

      await this.superHeroRepository.delete(superId);
      await this.redisService.deleteItemCache(
        `${RedisPrefixEnum.SUPERHEROES_ID}-${superHero.id}`,
        superHero,
      );

      return superHero;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating SuperHero:', error);
      throw new ConflictException(
        'Could not create SuperHero at the moment. Please try again later.',
      );
    }
  }
}
