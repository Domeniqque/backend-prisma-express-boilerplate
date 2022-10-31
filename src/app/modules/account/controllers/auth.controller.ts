import { Request } from "express";
import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { AuthenticateMiddleware } from "~/app/http/middleware/authenticate.middleware";
import { LoginPropsDto } from "../dtos/auth-user.dto";
import { AuthService } from "../services/auth.service";

@Service()
@JsonController("/account/auth/")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() { email, password }: LoginPropsDto) {
    const tokens = await this.authService.getTokens({ email, password });

    return tokens;
  }

  @Get("profile")
  @UseBefore(AuthenticateMiddleware)
  async me(@Req() request: Request) {
    return request.user;
  }
}
