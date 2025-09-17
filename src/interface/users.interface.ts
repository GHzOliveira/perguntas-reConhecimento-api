import { Users, UserResponse } from '@prisma/client';
import { CreateUserDto } from 'src/dto/dto-users/create-user.dto';
import { UpdateUserDto } from '../dto/dto-users/update-user.dto';

export interface IUsersRepository {
  create(data: CreateUserDto): Promise<Users>;
  findById(id: number): Promise<Users | null>;
  findAll(): Promise<Users[]>;
  findByCompanyId(companyId: number): Promise<Users[]>;
  delete(id: number): Promise<Users>;
  update(id: number, data: UpdateUserDto): Promise<Users>;
  updateDynamicResponses(
    userId: number,
    dynamicData: Record<string, any>,
  ): Promise<Users>;
  findDynamicResponses(userId: number): Promise<Record<string, any> | null>;
  submitResponses(
    userId: number,
    responses: Record<string, number>,
  ): Promise<void>;
  findResponsesById(userId: number): Promise<UserResponse[]>;
  markFormAsResponded(userId: number): Promise<Users>;
  checkFormResponse(id: number): Promise<boolean>;
}
