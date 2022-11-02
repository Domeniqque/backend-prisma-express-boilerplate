import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Service } from "typedi";
import crypto from "crypto";
import { addMilliseconds, isPast } from "date-fns";
import ms from "ms";
import { AuthPayload } from "~/@types/authentication";
import { AppConfig } from "~/config";
import { PrismaService } from "~/prisma/prisma.service";
import { UserService } from "./user.service";
import { User, UserTokens } from "@prisma/client";
import { logger } from "~/logger";

export type LoginProps = {
  email: string;
  password: string;
};

type RefreshTokensProps = {
  accessToken: string;
  refreshToken: string;
};

@Service()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  async login({ email, password }: LoginProps) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }

    const tokens = await this._createTokens(user);

    return tokens;
  }

  async refreshTokens({ accessToken, refreshToken }: RefreshTokensProps) {
    try {
      const { userId } = verify(accessToken, AppConfig.JWT_ACCESS_SECRET, {
        ignoreExpiration: true,
      }) as AuthPayload;

      const storedRefreshToken = await this.prisma.userTokens.findFirst({
        where: {
          refresh_token: refreshToken,
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      const logObj = {
        userId,
        refreshToken,
      };

      if (!storedRefreshToken) {
        logger.warn(logObj, `[RefreshToken] Refresh token not found`);
        return;
      }

      if (isPast(storedRefreshToken.expire_at)) {
        logger.warn(logObj, `[RefreshToken] Expired refresh token being used`);
        return;
      }

      await this.prisma.userTokens.delete({
        where: { id: storedRefreshToken.id },
      });

      const tokens = await this._createTokens(storedRefreshToken.user);

      return tokens;
    } catch (err) {
      return;
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.userTokens.deleteMany({
      where: {
        refresh_token: refreshToken,
      },
    });
  }

  async _createTokens(user: User) {
    const payload: AuthPayload = { email: user.email, userId: user.id };

    const accessToken = sign(payload, AppConfig.JWT_ACCESS_SECRET, {
      subject: user.email,
      expiresIn: AppConfig.JWT_ACCESS_EXPIRE_AT,
    });

    // Refresh token
    const { refresh_token } = await this._createRefreshToken(user.id);

    return { accessToken, refreshToken: refresh_token };
  }

  async _createRefreshToken(userId: number) {
    const randomString = crypto.randomBytes(10).toString("hex");
    const refreshToken = crypto
      .createHash("sha256")
      .update(randomString)
      .digest("hex");

    const expireAt = addMilliseconds(
      new Date(),
      ms(AppConfig.REFRESH_TOKEN_EXPIRE_AT)
    );

    const data = await this.prisma.userTokens.create({
      data: {
        user_id: userId,
        expire_at: expireAt,
        refresh_token: refreshToken,
      },
    });

    return data;
  }
}
