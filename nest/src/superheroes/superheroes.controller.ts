import { SUPERHEROES_CONTROLLER, SUPERHEROES_ROUTES } from '@/data/site';
import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query,  } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetAllSuperHeroesQuery } from './queries';
import { PAGINATION_LIMIT } from '../data';

@Controller(SUPERHEROES_CONTROLLER)
export class SuperheroesController {
                 constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
//     private readonly cloudinaryService: CloudinaryService,

  ) {}



  @Get(SUPERHEROES_ROUTES.GET_ALL)
    @ApiOperation({ summary: 'Get All Superheroes' })
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      type: Number,
    })
 async getAllSuperHeroes(    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
) {
  page = Math.max(1, page)
 const limit = Math.max(1, Math.min(PAGINATION_LIMIT,100));
const offset = (page - 1) * limit
  const res = await this.queryBus.execute(new GetAllSuperHeroesQuery(offset, page));
  return res
    // return this.queryBus.execute(new GetAllSuperheroesQuery());
  }



}