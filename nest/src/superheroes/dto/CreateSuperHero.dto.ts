import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperHeroDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  origin_description: string;

  @IsString({ each: true })
    @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  superpowers: string[];

  @IsString()
  @IsNotEmpty()
  catch_phrase: string;
}
