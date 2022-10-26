import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { logger } from "~/logger";

export async function seedUsers(prisma: PrismaClient, length = 20) {
  logger.info("Seeding users...");
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
        name: "Domeniqque Dylluar",
        email: "domeniqque@hotmail.com",
      }),
      ...Array.from({ length }).map(() => generateUser()),
    ],
  });
}
