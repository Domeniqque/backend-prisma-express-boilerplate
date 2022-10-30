import { Service } from "typedi";
import * as bcrypt from "bcrypt";
import { PrismaService } from "~/prisma/prisma.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { exclude } from "~/prisma/utils/exclude";

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

  async create(data: CreateUserDto) {
    const password = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password },
    });

    return exclude(user, "password");
  }
}
