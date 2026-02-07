import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { domainClient, domainClientDocker } from './data/defaultVariables';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
{    origin: [domainClient, domainClientDocker]}
  )

    


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      // exceptionFactory: (errors) => {
      //   return new BadRequestException(
      //     errors.map((err) => ({
      //       field: err.property,
      //       errors: Object.values(err.constraints),
      //     })),
      //   );
      // },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Documentation SuperHeroes Full Stack App')
    .setDescription('SuperHeroes Full Stack App app build on Nest.js+Next.js')
    .setVersion('1.0')
    .addTag('Main SuperHeroes', 'CRUD operations for SuperHeroes main entity')

    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@4/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js',
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
