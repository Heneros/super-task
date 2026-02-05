import { CreateSuperHeroDto } from '../dto/CreateSuperHero.dto';

export class DeleteSuperHeroCommand {
  constructor(public readonly superId: number) {}
}
