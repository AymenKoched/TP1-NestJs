import {Body, Controller, Delete, Get, Param, Patch, Post, Sse, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {UserEntity} from './entities/user.entity';
import {SignInUserDto} from "./dto/signin-user.dto";
import {LoginUserDto} from './dto/login-user.dto';
import {Observable, filter, fromEvent, map, merge} from "rxjs";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {EventEmitter2} from "@nestjs/event-emitter";
import {CV_EVENTS} from 'src/cv/cv-events.config';
import {User} from "../decorators/user/user.decorator";
import { UserSubscribeDto } from './dto/subscribe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2
  ){}

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

  @Post('/subscribe')
  subscribe(@Body() userSubscribeDto: UserSubscribeDto) {
    return this.userService.subscribe(userSubscribeDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('usernames')
  async findAllAsUser() {
    const users = await  this.userService.findAll();
    return users.map(user => user.username);
  }

  @Get('/listen')
  @UseGuards(JwtAuthGuard)
  @Sse('sse')
  sse(@User() user:  Partial<UserEntity>): Observable<MessageEvent> {
    if(user.role === "admin"){

      const addStream = fromEvent(this.eventEmitter, CV_EVENTS.add).pipe(
        map(( payload ) => new MessageEvent('new-cv', { data: payload })),
      );

      const deleteStream = fromEvent(this.eventEmitter, CV_EVENTS.delete).pipe(
        map((payload) => new MessageEvent('cv-deleted', { data: payload })),
      );

      const updateStream = fromEvent(this.eventEmitter, CV_EVENTS.update).pipe(
        map((payload ) => new MessageEvent('cv-updated', { data: payload })),
      );
      
      return merge(addStream, deleteStream, updateStream);
    }
    else{
      const userId = user.id ;
      const addStream = fromEvent(this.eventEmitter, CV_EVENTS.add).pipe(
        filter((payload: any) => payload.user.id === userId) ,
        map((payload: any) => new MessageEvent('new-cv', { data: payload }))
      );
      const deleteStream = fromEvent(this.eventEmitter, CV_EVENTS.delete).pipe(
        filter((payload: any) => payload.user.id === userId),
        map((payload: any) => new MessageEvent('cv-deleted', { data: payload }))
      );

      const updateStream = fromEvent(this.eventEmitter, CV_EVENTS.update).pipe(
        filter((payload: any) => payload.user.id === userId),
        map((payload: any) => new MessageEvent('cv-updated', { data: payload }))
      );

      return merge(addStream, updateStream, deleteStream);
    }
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
