import { Injectable } from '@nestjs/common';
import { Prisma, UserResponse, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { filialId, companyId, ...userData } = createUserDto;
    return this.prisma.users.create({
      data: {
        ...userData,
        filial: { connect: { id: filialId } },
        company: { connect: { id: companyId } },
      },
    });
  }

  async findUserById(id: number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findAllUsers(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async submitUserResponse(
    userId: number,
    responses: Record<string, number>,
  ): Promise<void> {
    const responseEntries = Object.entries(responses).map(
      ([question, score]) => ({
        userId,
        question: parseInt(question, 10),
        score,
      }),
    );

    await this.prisma.$transaction(
      responseEntries.map((entry) =>
        this.prisma.userResponse.upsert({
          where: {
            userId_question: { userId: entry.userId, question: entry.question },
          },
          update: entry,
          create: entry,
        }),
      ),
    );
  }

  async findUserResponsesById(userId: number): Promise<UserResponse[]> {
    return this.prisma.userResponse.findMany({
      where: { userId },
    });
  }

  async deleteUser(id: number): Promise<Users> {
    await this.prisma.userResponse.deleteMany({
      where: { userId: id },
    });

    return this.prisma.users.delete({
      where: { id },
    });
  }

  async updateUser(id: number, data: Prisma.UsersUpdateInput): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async markFormAsResponded(userId: number): Promise<Users> {
    return this.prisma.users.update({
      where: { id: userId },
      data: { respondeuForm: true },
    });
  }

  async checkFormResponseById(id: number): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: { respondeuForm: true },
    });
    return user ? user.respondeuForm : false;
  }
}
