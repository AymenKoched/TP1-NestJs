import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import {PayloadJwtTokenInterface} from '../interfaces/payload-jwttoken.interface';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {UserEntity} from "../entities/user.entity";

export class PassportJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadJwtTokenInterface): Promise<Partial<UserEntity>> {
    //console.log(payload);
    const user: UserEntity = await this.userRepository.findOne({ where: { id: payload.id } });
    //console.log(user);
    if(user){
      delete user.salt;
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}