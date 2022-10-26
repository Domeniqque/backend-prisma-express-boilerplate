import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export const AppConfig = cleanEnv(process.env, {
  PORT: num({ default: 3030 }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_EXPIRE_AT: str({ default: "1d" }),
});
