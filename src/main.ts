import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import {RedocModule, RedocOptions} from 'nestjs-redoc';

async function bootstrap() {
  const logger = new Logger('Food Delivery System');
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: '*' });
  }

  const options = new DocumentBuilder()
    .setTitle('Delivery app')
    .setDescription('The delivery app API description')
    .setVersion('1.0')
    .addTag('delivery')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const redocOptions: RedocOptions = {
    title: 'Hello Nest',
    logo: {
      url: 'https://redocly.github.io/redoc/petstore-logo.png',
      backgroundColor: '#F0F0F0',
      altText: 'PetStore logo'
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false
  };
  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/docs', app, document, redocOptions);

  SwaggerModule.setup('doc', app, document);
  await app.listen(3001);
  logger.log(`Application Listening on Port ${3001} `);
  logger.log(`Api documentation avaliable at "/doc/`);
}
bootstrap();
