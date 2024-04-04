import { IsEmail, IsNotEmpty } from 'class-validator';
import {Trim} from "../../decorators/trimmed/Trim.decorator";

export class SignInUserDto {
  @IsNotEmpty()
  @Trim()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email: string;

  @IsNotEmpty()
  @Trim()
  password: string;
}
