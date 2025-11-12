import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import { AppModule } from './app.module';

const nestLogger = new Logger('HTTP');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  //API ROUTES PREFIX
  app.setGlobalPrefix(process.env.URLS_API_ROOT ?? '/api');

  //VERSIONING
  app.enableVersioning({
    type: 0,
    defaultVersion: '1',
  });

  //CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  //MORGAN REQUEST LOGS
  app.use(
    morgan.default(
      ':method :url :status :res[content-length] - :response-time ms',
      {
        stream: {
          write: (message) => nestLogger.log(message.trim()),
        },
      },
    ),
  );

  //VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? '/TECH-TEST-NEST')
    .setDescription(`The ${process.env.APP_NAME} API description`)
    .setVersion('1.0')
    .addServer(
      `${process.env.URLS_PROTOCOL ?? 'http'}://${process.env.URLS_URL ?? 'localhost'}${':'}${process.env.URLS_PORT ?? '8888'}`,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`swagger`, app, document);
  await app.listen(process.env.PORT ?? 8888);
}
bootstrap();
