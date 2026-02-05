import { SuperHeroesRepository } from '@/superheroes/repository/SuperHeroes.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckSuperHeroExistPipe implements PipeTransform {
  constructor(private superHeroRepository: SuperHeroesRepository) {}

  async transform(superHeroId: number): Promise<number | null> {
    if (!superHeroId || isNaN(superHeroId)) {
      throw new BadRequestException('Either superHeroId must be provided 4');
    }
    const user = await this.superHeroRepository.findUnique({
      id: superHeroId,
    });
    if (!user) {
      throw new NotFoundException('No superHero exists with this data');
    }

    return superHeroId;
  }
}
