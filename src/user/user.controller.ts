import { Controller ,  Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import {SignInUserDto} from "./dto/signin-user.dto";
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}

  @Post('signin')
  async signIn(
    @Body() newUser: SignInUserDto,
  ): Promise<Partial<UserEntity>> {
    return this.userService.signIn(newUser);
  }

  @Post('login')
  async login(
    @Body() userCredentials: LoginUserDto,
  ){
    return this.userService.login(userCredentials);
  }
}
