import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username:string;
    
    
    @IsEmail()
    @IsOptional()
    email:string;
    
    
    @IsString()
    @IsOptional()
    password:string;
}