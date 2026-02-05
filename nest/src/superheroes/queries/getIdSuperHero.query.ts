import { IQuery } from '@nestjs/cqrs';

export class GetIdSuperHeroQuery implements IQuery {
  constructor(public readonly superHeroId: number) {}
}
