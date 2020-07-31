import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Food Delivery System');
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Delivery app')
    .setDescription('The delivery app API description')
    .setVersion('1.0')
    .addTag('delivery')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(3000);
  logger.log(`Application Listening on Port ${3000} `);
  logger.log(`Api documentation avaliable at "/doc/`);
}
bootstrap();
