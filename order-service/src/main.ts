import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3002;
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

  // Enable CORS
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) =>
            `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
        );
        return new Error(messages.join('; '));
      },
    }),
  );

  // Enable serialization (transforms Date to ISO string)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('API for managing orders with inter-service communication')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Order Service is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();
