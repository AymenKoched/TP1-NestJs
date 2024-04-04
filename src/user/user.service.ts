import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import process from "process";
import {SignInUserDto} from "./dto/signin-user.dto";
import * as bcrypt from 'bcrypt';
import {handle_error} from "../helpers/user.unique-username-email/user.unique-username-email";
import {LoginUserDto} from "./dto/login-user.dto";
import {UserRoleEnum} from "../enums/user-role.enum";


@Injectable()
export class UserService {
constructor(@InjectRepository(UserEntity)
  private userRepository : Repository<UserEntity> ){}

  async signIn(newUser: SignInUserDto): Promise<Partial<UserEntity>> {
    const user = this.userRepository.create({
      ...newUser
    });

    user.salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, user.salt);

    try {
      await this.userRepository.save(user);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

    }
    catch (err) {
      const errors = handle_error(err);
      const error = {
        message: errors,
        error: 'Bad Request',
        statusCode: 400,
      };

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async login(userCredentials: LoginUserDto) {
    const {email, password} = userCredentials;

    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', {email})
      .getOne();

    if(!user) throw new NotFoundException('email not found');

    const hashedPassword = await bcrypt.hash(password, user.salt);
    const auth = hashedPassword == user.password;

    if(!auth) throw new NotFoundException('password is wrong');

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    // const jwtToken = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET});

    // return {
    //   'token': jwtToken
    // };

    return payload;
  }

  isOwnerOrAdmin(object, user) {
    return user.role === UserRoleEnum.ADMIN || (object.user && object.user.id === user.id);
  }
}