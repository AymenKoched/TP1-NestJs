import { PartialType } from '@nestjs/mapped-types';
import {SignInUserDto} from "./signin-user.dto";

export class UpdateUserDto extends PartialType(SignInUserDto) {}

