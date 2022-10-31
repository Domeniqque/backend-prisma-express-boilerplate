import { IsEmail, IsString } from "class-validator";

export class LoginPropsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
