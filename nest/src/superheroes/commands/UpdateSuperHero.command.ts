import { UpdateSuperHeroDto } from '../dto/UpdateSuperHero.dto';

export class UpdateSuperHeroCommand {
  constructor(
    public readonly superId: number,
    public readonly updateSuperHeroDto: UpdateSuperHeroDto,
  ) {}
}
