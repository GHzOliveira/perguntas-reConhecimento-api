import { Users, UserResponse, Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/dto-users/create-user.dto';

export interface IUsersRepository {
  create(data: CreateUserDto): Promise<Users>;
  findById(id: number): Promise<Users | null>;
  findAll(): Promise<Users[]>;
  findByCompanyId(companyId: number): Promise<Users[]>;
  delete(id: number): Promise<Users>;
  update(id: number, data: Prisma.UsersUpdateInput): Promise<Users>;
  submitResponses(userId: number, responses: Record<string, number>): Promise<void>;
  findResponsesById(userId: number): Promise<UserResponse[]>;
  markFormAsResponded(userId: number): Promise<Users>;
  checkFormResponse(id: number): Promise<boolean>;
}