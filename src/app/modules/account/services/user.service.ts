import { Service } from "typedi";
import { PrismaService } from "~/prisma/prisma.service";

@Service()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });
  }
}
