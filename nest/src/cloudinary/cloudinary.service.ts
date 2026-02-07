import { SuperHeroesRepository } from '@/superheroes/repository/SuperHeroes.repository';
import path, { join } from 'path';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
// import { folderCloud } from '../data';
import { randomBytes } from 'crypto';
import { folderCloudinary } from '../data';
import 'multer';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
 

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(private prismaService: PrismaService) {}

  async uploadImgSuper(superId: number, file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException({
        message: 'Invalid image file',
        name: 'Error',
        http_code: 400,
      });
    }

    try {
      const superHero = await this.prismaService.superHero.findUnique({
        where: { id: superId },
      });

      if (!superHero) {
        throw new NotFoundException('Superhero not found');
      }

      const fileName = randomBytes(16).toString('hex');
      const ext = file.originalname.split('.').pop() || 'png';
      const uniqueFileName = `${fileName}_${Date.now()}.${ext}`;

      const uploadsFolder = join(process.cwd(), 'uploads', 'superheroes');

      if (!existsSync(uploadsFolder)) {
        mkdirSync(uploadsFolder, { recursive: true });
      }

      const filePath = join(uploadsFolder, uniqueFileName);

      writeFileSync(filePath, file.buffer);

      const newImage = await this.prismaService.images.create({
        data: {
          posterUrl: `http://localhost:3000/uploads/superheroes/${uniqueFileName}`,
          publicId: fileName,
          superHeroId: superId,
          isMain: false,
        },
      });

      return { newImage };
    } catch (error) {
      console.error('Error uploading superhero image locally:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException({
        message: `Upload error: ${error.message}`,
        statusCode: 400,
      });
    }
  }

  //     async uploadImgSuper(superId: number, file: Express.Multer.File) {
  //     if (!file.mimetype.startsWith('image/')) {
  //       throw new BadRequestException({
  //         message: 'Invalid image file',
  //         name: 'Error',
  //         http_code: 400,
  //       });
  //     }

  //     try {
  //       const mainFolder = folderCloudinary;
  //       const fileName = randomBytes(16).toString('hex');
  //       const uniqueFileName = `${fileName}_${Date.now()}`;
  //       const filePathOnCloudinary = `${mainFolder}/${uniqueFileName}`;

  //  const superHero = await this.prismaService.superHero.findUnique({
  //   where: { id: superId },
  // });

  // if (!superHero) {
  //   throw new NotFoundException('Superhero not found');
  // }
  //       const backDropImg = await new Promise<{
  //         url: string;
  //         publicId: string;
  //       }>((resolve, reject) => {
  //         const uploadStream = cloudinary.uploader.upload_stream(
  //           {
  //             public_id: filePathOnCloudinary,
  //             resource_type: 'image',
  //             fetch_format: 'auto',
  //             quality: 'auto:eco',
  //             crop: 'limit',
  //           },
  //           (
  //             err: UploadApiErrorResponse | undefined,
  //             result: UploadApiResponse | undefined,
  //           ) => {
  //             if (err || !result?.secure_url || !result.public_id) {
  //               return reject(err ?? new Error('Invalid Cloudinary response'));
  //             } else if (result && result.secure_url) {
  //               resolve({
  //                 url: result.secure_url,
  //                 publicId: result.public_id,
  //               });
  //             } else {
  //               reject(
  //                 new Error('Failed to get secure_url from Cloudinary response'),
  //               );
  //             }
  //           },
  //         );

  //         if (!file.buffer) {
  //           reject(new Error('File buffer is empty'));
  //           return;
  //         }

  //         streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //       });

  //                               const imagesCount = await this.prismaService.images.count({
  //   where: { superHeroId: superId },
  // });

  // const newImage = await this.prismaService.images.create({
  //   data: {
  //     posterUrl: backDropImg.url,
  //     publicId: uniqueFileName,
  //     superHeroId: superId,
  //     isMain: false
  //   },
  // });
  //       return { newImage: newImage };
  //     } catch (error) {
  //       if (error instanceof BadRequestException) {
  //         throw error;
  //       }

  //       if (error instanceof Error && 'http_code' in error) {
  //         throw new BadRequestException({
  //           message: `Cloudinary error: ${error.message}`,
  //           statusCode: (error as any).http_code || 400,
  //         });
  //       }

  //       console.error(`Error in uploadToCloudinary::  ${error}`);
  //     }
  //   }

  async deleteImgSuper(publicId: string) {
    // const result = await cloudinary.uploader.destroy(publicId, {
    //   resource_type: 'image',
    // });
    const deletedImage = await this.prismaService.images.findUnique({
      where: { publicId },
    });

    if (!deletedImage) {
      throw new NotFoundException('Image not found in database');
    }

    await this.prismaService.images.delete({
      where: { publicId },
    });

    return deletedImage;
  }

  async setImageMain(publicId: string) {
    const findImage = await this.prismaService.images.findUnique({
      where: { publicId },
    });
    if (!findImage) {
      throw new NotFoundException('Image not found in database');
    }
    const res = await this.prismaService.$transaction([
      this.prismaService.images.updateMany({
        where: {
          superHeroId: findImage.superHeroId,
          isMain: true,
        },
        data: { isMain: false },
      }),
      this.prismaService.images.update({
        where: { publicId },
        data: { isMain: true },
      }),
    ]);
    return res;
  }

  async getAllImagesBySuperHero(superId: number) {
    const images = await this.prismaService.images.findMany({
      where: { superHeroId: superId },
    });
    return images;
  }
}
