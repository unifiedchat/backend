import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import CONFIG from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.use(
    morgan(':remote-addr :url :method :req[origin] :status :response-time ms'),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      transform: true,
      whitelist: true, // Delete properties which is not in dto
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // skipMissingProperties: true,
    }),
  );

  app.enableCors({
    origin: CONFIG.ORIGINS,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('Ping Pong Documentation')
    .setVersion(CONFIG.VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });

  await app.listen(3000);
}
bootstrap();
