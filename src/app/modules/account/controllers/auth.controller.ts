import { Request } from "express";
import {
  Body,
  Get,
  JsonController,
  OnUndefined,
  Post,
  Req,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { AuthenticateMiddleware } from "~/app/http/middleware/authenticate.middleware";
import {
  LoginPropsDto,
  LogoutProps,
  RefreshTokenPropsDto,
} from "../dtos/auth-user.dto";
import { AuthService } from "../services/auth.service";

@Service()
@JsonController("/account/auth/")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() { email, password }: LoginPropsDto) {
    const tokens = await this.authService.login({ email, password });

    return tokens;
  }

  @Post("refresh-token")
  @OnUndefined(401)
  async refreshToken(
    @Body() { accessToken, refreshToken }: RefreshTokenPropsDto
  ) {
    const tokens = await this.authService.refreshTokens({
      accessToken,
      refreshToken,
    });

    return tokens;
  }

  @Post("logout")
  async logout(@Body() { refreshToken }: LogoutProps) {
    await this.authService.logout(refreshToken);
  }

  @Get("profile")
  @UseBefore(AuthenticateMiddleware)
  async me(@Req() request: Request) {
    return request.user;
  }
}
