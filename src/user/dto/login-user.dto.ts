import { IsEmail, IsNotEmpty } from 'class-validator';
import {Trim} from "../../decorators/trimmed/Trim.decorator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email: string;

  @IsNotEmpty()
  @Trim()
  password: string;
}
