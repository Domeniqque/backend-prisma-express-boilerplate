import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";
import { AuthPayload } from "~/@types/authentication";
import { AppConfig } from "~/config";
import { UserService } from "./user.service";

export type LoginProps = {
  email: string;
  password: string;
};

@Service()
export class AuthService {
  constructor(private userService: UserService) {}

  async getTokens({ email, password }: LoginProps) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }

    const payload: AuthPayload = { email: user.email, userId: user.id };

    const access_token = sign(payload, AppConfig.JWT_SECRET, {
      subject: user.email,
      expiresIn: AppConfig.JWT_EXPIRE_AT,
    });

    // TODO: refresh token

    return { access_token };
  }
}
