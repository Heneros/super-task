import { ApiProperty } from '@nestjs/swagger';

export class UploadSuperHeroImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Superhero image file',
  })
  image: any;
}
