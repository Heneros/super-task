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
    // const { } = command;
  }
}
