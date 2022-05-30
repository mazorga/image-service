import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {

  const app = await NestFactory.create(AppModule);

// Swagger
const config = new DocumentBuilder()
    .setTitle('Image-Service')
    .setDescription('The images API description')
    .setVersion('1.0')
    .addTag('images')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

// Validation
 app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
