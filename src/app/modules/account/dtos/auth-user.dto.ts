import { IsEmail, IsString } from "class-validator";

export class LoginPropsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenPropsDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

export class LogoutProps {
  @IsString()
  refreshToken: string;
}
