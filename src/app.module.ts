import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { SkillModule } from './skill/skill.module';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';

import * as process from 'process';
import { AuthMiddleware } from './Middlewares/auth.middleware';

@Module({
  imports: [CvModule,UserModule,SkillModule,
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
    CvModule,
    SkillModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer : MiddlewareConsumer)
  {
    consumer.apply(AuthMiddleware).forRoutes('todo/:*');
  }
}
