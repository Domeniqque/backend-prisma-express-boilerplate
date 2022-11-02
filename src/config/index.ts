import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export const AppConfig = cleanEnv(process.env, {
  PORT: num({ default: 3030 }),
  DATABASE_URL: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_ACCESS_EXPIRE_AT: str({ default: "30m" }),
  REFRESH_TOKEN_EXPIRE_AT: str({ default: "5d" }),
});
