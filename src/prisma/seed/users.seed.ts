import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { AppConfig } from "~/config";

export async function seedUsers(prisma: PrismaClient, length = 20) {
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  const generateUser = (data?: Partial<User>) =>
    ({
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase(),
      password,
      ...data,
    } as User);

  await prisma.user.createMany({
    data: [
      generateUser({
        name: "Admin User",
        email: "admin@admin.com",
      }),
      ...(AppConfig.isDevelopment
        ? Array.from({ length }).map(() => generateUser())
        : []),
    ],
  });
}
