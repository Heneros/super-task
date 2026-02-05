import { CreateSuperHeroDto } from '../dto/CreateSuperHero.dto';

export class CreateSuperHeroCommand {
  constructor(public readonly createSuperHeroDto: CreateSuperHeroDto) {}
}
