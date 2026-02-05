import { PartialType } from '@nestjs/mapped-types';

import { CreateSuperHeroDto } from './CreateSuperHero.dto';

export class UpdateSuperHeroDto extends PartialType(CreateSuperHeroDto) {}
  