import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvController } from './cv/cv.controller';
import { CvService } from './cv/cv.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { SkillController } from './skill/skill.controller';
import { SkillService } from './skill/skill.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { SkillModule } from './skill/skill.module';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';

import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      options: {
        trustServerCertificate: true,
      }
    }),
    SkillModule,
    CvModule,
    UserModule,
  ],
  controllers: [AppController, CvController, UserController, SkillController],
  providers: [AppService, CvService, UserService, SkillService],
})
export class AppModule {}
