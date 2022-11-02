import { PrismaClient } from "@prisma/client";
import { logger } from "~/logger";
import { seedUsers } from "./users.seed";

const prisma = new PrismaClient();

async function main() {
  logger.info("Seeding started");

  await seedUsers(prisma);
  logger.info("Seeding finished");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info("Seed completed!");
  });
