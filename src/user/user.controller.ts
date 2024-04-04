import { Controller ,  Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
constructor(private readonly userService: UserService){}

// add new user 
@Post()
 create(
    @Body() CreateUserDto : CreateUserDto 
) 
{
        return  this.userService.create(CreateUserDto);
}

// find all users 

@Get()
findAll() {
    return this.userService.findAll();
}

//find by id 


@Get(':id')

findById(
@Param('id') id : string
)
{
    return this.userService.findOne(id);
}
// update user by id
@Patch(':id')
update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
) {
    return this.userService.update(id, updateUserDto);
}

// delete user by id
@Delete(':id')
remove(@Param('id') id: string) {
    return this.userService.remove(id);
}








}
