import { Injectable, Logger } from '@nestjs/common';
import { Users, UserResponse, Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/dto-users/create-user.dto';
import { UsersRepository } from 'src/repositories/users.repositorie';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private readonly logger = new Logger(UsersService.name);

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    return this.usersRepository.create(createUserDto);
  }

  async findUserById(id: number): Promise<Users | null> {
    return this.usersRepository.findById(id);
  }

  async findAllUsers(): Promise<Users[]> {
    return this.usersRepository.findAll();
  }

  async findUsersByCompanyId(companyId: number): Promise<Users[]> {
    this.logger.log(`Buscando usuários da empresa ${companyId}`);
    return this.usersRepository.findByCompanyId(companyId);
  }

  async submitUserResponse(
    userId: number,
    responses: Record<string, number>,
  ): Promise<void> {
    return this.usersRepository.submitResponses(userId, responses);
  }

  async findUserResponsesById(userId: number): Promise<UserResponse[]> {
    return this.usersRepository.findResponsesById(userId);
  }

  async deleteUser(id: number): Promise<Users> {
    return this.usersRepository.delete(id);
  }

  async updateUser(id: number, data: Prisma.UsersUpdateInput): Promise<Users> {
    return this.usersRepository.update(id, data);
  }

  async markFormAsResponded(userId: number): Promise<Users> {
    return this.usersRepository.markFormAsResponded(userId);
  }

  async checkFormResponseById(id: number): Promise<boolean> {
    return this.usersRepository.checkFormResponse(id);
  }
}