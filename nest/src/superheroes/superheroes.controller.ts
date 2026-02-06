import { SUPERHEROES_CONTROLLER, SUPERHEROES_ROUTES } from '@/data/site';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetAllSuperHeroesQuery, GetIdSuperHeroQuery } from './queries';
import { PAGINATION_LIMIT } from '../data';
import { CreateSuperHeroDto } from './dto/CreateSuperHero.dto';
import { UpdateSuperHeroDto } from './dto/UpdateSuperHero.dto';
import {
  CreateSuperHeroCommand,
  UpdateSuperHeroCommand,
  DeleteSuperHeroCommand,
} from './commands';
import { GetSuperHeroById } from './handlers';
import { CheckSuperHeroExistPipe } from '@/pipe/SuperHero.pipe';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Controller(SUPERHEROES_CONTROLLER)
export class SuperheroesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
      private readonly cloudinaryService: CloudinaryService,
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
    @Param('superheroId', ParseIntPipe, CheckSuperHeroExistPipe)
    superheroId: number,
    @Body() updateSuperHeroDto: UpdateSuperHeroDto,
  ) {
    const res = await this.commandBus.execute(
      new UpdateSuperHeroCommand(superheroId, updateSuperHeroDto),
    );
    return res;
  }

  @Delete(SUPERHEROES_ROUTES.DELETE_SUPERHERO)
  @ApiOperation({ summary: 'Delete Superhero' })
  async deleteSuperHero(
    @Param('superheroId', ParseIntPipe, CheckSuperHeroExistPipe)
    superheroId: number,
  ) {
    const res = await this.commandBus.execute(
      new DeleteSuperHeroCommand(superheroId),
    );
    return res;
  }

  @Get(SUPERHEROES_ROUTES.GET_ID_SUPERHERO)
  @ApiOperation({ summary: 'Get Superhero by ID' })
  async getSuperHeroById(
    @Param('superheroId', ParseIntPipe, CheckSuperHeroExistPipe)
    superheroId: number,
  ) {
    const res = await this.queryBus.execute(
      new GetIdSuperHeroQuery(superheroId),
    );
    return res;
  }


  @Patch(SUPERHEROES_ROUTES.UPDATE_SUPERHERO_IMAGE)
  @ApiOperation({ summary: 'Update Superhero Image' })
  @UseInterceptors(
    FileInterceptor('image', {
          storage: memoryStorage(),
          limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async updateSuperHeroImage(
    @Param('superheroId', ParseIntPipe, CheckSuperHeroExistPipe) superheroId: number,
    @UploadedFile() file: Express.Multer.File
  ){
    try {
         if (!file) {
        console.error('FILE:', file);
        return 'Error during upload file';
      }
      return await this.cloudinaryService.uploadImgSuper( superheroId, file);
    } catch (error) {
      console.error('Error updating superhero image:', error);
      throw error;
    }
  }



  @Delete(SUPERHEROES_ROUTES.DELETE_SUPERHERO_IMAGE)
  @ApiOperation({ summary: 'Delete Superhero Image' })
  async deleteSuperHeroImage(
    @Param('publicId') publicId: string,
  ){
    try {
      return await this.cloudinaryService.deleteImgSuper(publicId);
    } catch (error) {
      console.error('Error deleting superhero image:', error);
      throw error;
    }
  }

    @Patch(SUPERHEROES_ROUTES.SET_SUPERHERO_IMAGE)
  @ApiOperation({ summary: 'Set Superhero Image Main' })
  async setImageMain(
    @Param('publicId') publicId: string,
  ){
    try {
      return await this.cloudinaryService.setImageMain(publicId);
    } catch (error) {
      console.error('Error setting superhero image main:', error);
      throw error;
    }
  }
}
