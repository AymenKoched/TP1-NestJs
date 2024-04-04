import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as process from "process";
import helmet from 'helmet';
import {ConfigService} from "@nestjs/config";
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.use(morgan('dev'));
  app.use(helmet());

  console.log(process.env);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port || 3000);
}
bootstrap();
