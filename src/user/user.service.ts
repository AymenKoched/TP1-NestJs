import {ConflictException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {SignInUserDto} from "./dto/signin-user.dto";
import * as bcrypt from 'bcrypt';
import * as process from "process";
import {handle_error} from "../helpers/user.unique-username-email/user.unique-username-email";
import {LoginUserDto} from "./dto/login-user.dto";
import {UserRoleEnum} from "../enums/user-role.enum";
import {JwtService} from "@nestjs/jwt";
import { UserSubscribeDto } from './dto/subscribe-user.dto';
import {UpdateCvDto} from "../cv/dto/update-cv.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {CvEntity} from "../cv/entities/cv.entity";


@Injectable()
export class UserService {
constructor(
  @InjectRepository(UserEntity)
  private readonly userRepository : Repository<UserEntity>,
  private readonly jwtService: JwtService,
){}

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

  async login(userCredentials: LoginUserDto): Promise<{token: string}> {
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

    const jwtToken = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET});

    return {
      'token': jwtToken
    };
  }

  isOwnerOrAdmin(object, user) {
    return user.role === UserRoleEnum.ADMIN || (object.user && object.user.id === user.id);
  }

  async subscribe(userData:UserSubscribeDto) : Promise<Partial<UserEntity>>{
    const {username ,password,email} = userData;
    let user = this.userRepository.create(
      {username,password,email});
    try {
      await this.userRepository.save(user);
    }catch(err){
      throw new ConflictException("data not found !!!");
    }
    return {
      id : user.id,
      username  : user.username,
      email : user.email,
      password : user.password
    } ;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id:string) {
    return this.userRepository.findOneBy({id});
  }

  async update(id: string, updatedUser:UpdateUserDto) {
    const oldCv = await this.findOne(id);

    const newUser = await this.userRepository.update({id},updatedUser );

    return newUser;
  }

  async remove(id: string) {
    const userToDelete =await this.findOne(id);
    return await this.userRepository.softRemove(userToDelete);
  }
}