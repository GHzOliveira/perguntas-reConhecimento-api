import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users, UserResponse } from '@prisma/client';
import { IUsersRepository } from '../interface/users.interface';
import { CreateUserDto } from '../dto/dto-users/create-user.dto';
import { UsersException } from '../exceptions/users.exception';
import { UpdateUserDto } from 'src/dto/dto-users/update-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const { filialId, companyId, dynamicResponses, ...userData } = createUserDto;
      
      return await this.prisma.users.create({
        data: {
          ...userData,
          dynamicResponses: dynamicResponses || {},
          filial: { connect: { id: filialId } },
          company: { connect: { id: companyId } },
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`);
      throw new UsersException('Erro ao criar usuário');
    }
  }

  async findById(id: number): Promise<Users | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário ${id}: ${error.message}`);
      throw new UsersException(`Erro ao buscar usuário ${id}`);
    }
  }

  async findAll(): Promise<Users[]> {
    try {
      return await this.prisma.users.findMany();
    } catch (error) {
      this.logger.error(`Erro ao buscar usuários: ${error.message}`);
      throw new UsersException('Erro ao buscar usuários');
    }
  }

  async findByCompanyId(companyId: number): Promise<Users[]> {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          companyId,
        },
        include: {
          filial: true,
          respostas: true,
        },
      });

      if (!users.length) {
        this.logger.warn(`Nenhum usuário encontrado para a empresa ${companyId}`);
      }

      return users;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuários da empresa ${companyId}: ${error.message}`);
      throw new UsersException(`Erro ao buscar usuários da empresa ${companyId}`);
    }
  }

  async delete(id: number): Promise<Users> {
    try {
      await this.prisma.userResponse.deleteMany({
        where: { userId: id },
      });
      return await this.prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Erro ao deletar usuário ${id}: ${error.message}`);
      throw new UsersException(`Erro ao deletar usuário ${id}`);
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<Users> {
    try {
      const { filialId, companyId, dynamicResponses, ...updateData } = data;
      const updatePayload: any = { ...updateData };
      if (filialId) {
        updatePayload.filial = { connect: { id: filialId } };
      }
      
      if (companyId) {
        updatePayload.company = { connect: { id: companyId } };
      }
      
      if (dynamicResponses) {
        updatePayload.dynamicResponses = dynamicResponses;
      }

      return await this.prisma.users.update({
        where: { id },
        data: updatePayload,
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário ${id}: ${error.message}`);
      throw new UsersException(`Erro ao atualizar usuário ${id}`);
    }
  }

  async updateDynamicResponses(
    userId: number,
    dynamicData: Record<string, any>,
  ): Promise<Users> {
    try {
      const currentUser = await this.findById(userId);
      if (!currentUser) {
        throw new UsersException(`Usuário ${userId} não encontrado`);
      }

      const currentDynamicData = currentUser.dynamicResponses as Record<string, any> || {};
      const mergedDynamicData = { ...currentDynamicData, ...dynamicData };

      return await this.prisma.users.update({
        where: { id: userId },
        data: { dynamicResponses: mergedDynamicData },
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar respostas dinâmicas do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao atualizar respostas dinâmicas do usuário ${userId}`);
    }
  }

  async findDynamicResponses(userId: number): Promise<Record<string, any> | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        select: { dynamicResponses: true },
      });
      
      if (!user.dynamicResponses) {
        return null;
      }
      
      return user.dynamicResponses as Record<string, any>;
    } catch (error) {
      this.logger.error(`Erro ao buscar respostas dinâmicas do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao buscar respostas dinâmicas do usuário ${userId}`);
    }
  }

  

  async submitResponses(
    userId: number,
    responses: Record<string, number>,
  ): Promise<void> {
    try {
      const responseEntries = Object.entries(responses).map(([question, score]) => ({
        userId,
        question: parseInt(question, 10),
        score,
      }));

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
    } catch (error) {
      this.logger.error(`Erro ao submeter respostas do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao submeter respostas do usuário ${userId}`);
    }
  }

  async findResponsesById(userId: number): Promise<UserResponse[]> {
    try {
      return await this.prisma.userResponse.findMany({
        where: { userId },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar respostas do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao buscar respostas do usuário ${userId}`);
    }
  }

  async markFormAsResponded(userId: number): Promise<Users> {
    try {
      return await this.prisma.users.update({
        where: { id: userId },
        data: { respondeuForm: true },
      });
    } catch (error) {
      this.logger.error(`Erro ao marcar formulário como respondido ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao marcar formulário como respondido ${userId}`);
    }
  }

  async checkFormResponse(id: number): Promise<boolean> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        select: { respondeuForm: true },
      });
      return user ? user.respondeuForm : false;
    } catch (error) {
      this.logger.error(`Erro ao verificar resposta do formulário ${id}: ${error.message}`);
      throw new UsersException(`Erro ao verificar resposta do formulário ${id}`);
    }
  }
}