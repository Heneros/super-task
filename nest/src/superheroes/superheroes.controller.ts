import { SUPERHEROES_CONTROLLER, SUPERHEROES_ROUTES } from '@/data/site';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetAllSuperHeroesQuery } from './queries';
import { PAGINATION_LIMIT } from '../data';
import { CreateSuperHeroDto } from './dto/CreateSuperHero.dto';
import { UpdateSuperHeroDto } from './dto/UpdateSuperHero.dto';
import { CreateSuperHeroCommand, UpdateSuperHeroCommand, DeleteSuperHeroCommand } from './commands';

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
  async getAllSuperHeroes(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    page = Math.max(1, page);
    const limit = Math.max(1, Math.min(PAGINATION_LIMIT, 100));
    const offset = (page - 1) * limit;
    const res = await this.queryBus.execute(
      new GetAllSuperHeroesQuery(offset, page),
    );
    return res;
  }

  @Post(SUPERHEROES_ROUTES.CREATE_SUPERHERO)
  @ApiOperation({ summary: 'Create Superhero' })
  async createSuperHero(@Body() createSuperHeroDto: CreateSuperHeroDto) {
    const res = await this.commandBus.execute(
      new CreateSuperHeroCommand(createSuperHeroDto),
    );
    return res;

}

  @Patch(SUPERHEROES_ROUTES.UPDATE_SUPERHERO)
  @ApiOperation({ summary: 'Update Superhero' })
  async updateSuperHero(
    
    @Body() updateSuperHeroDto: UpdateSuperHeroDto) {
    const res = await this.commandBus.execute(
      new UpdateSuperHeroCommand(updateSuperHeroDto),
    );
    return res;

}

}
