import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const options = new DocumentBuilder()
  .setTitle('Delivery app')
  .setDescription('The delivery app API description')
  .setVersion('1.0')
  .addTag('delivery')
  .build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('doc', app, document);
  await app.listen(3000);
}
bootstrap();
