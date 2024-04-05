import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import {PassportJwtStrategy} from "./strategy/passport-jwt.strategy";

const jwtMaxAge = 2 * 24 * 60 * 60;

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions:{
                expiresIn: jwtMaxAge,
            }
        }),
    ],
    controllers: [UserController],
    providers: [UserService, PassportJwtStrategy],
    exports: [UserService]
})
export class UserModule {}
