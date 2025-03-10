import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Users, UserResponse } from '@prisma/client';
import { CreateUserDto } from '../dto/dto-users/create-user.dto';
import { UsersRepository } from '../repositories/users.repositorie';
import { UpdateUserDto } from '../dto/dto-users/update-user.dto';
import Ajv from 'ajv';
import { UsersException } from '../exceptions/users.exception';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly ajv: Ajv;

  constructor(private readonly usersRepository: UsersRepository) {
    this.ajv = new Ajv({ allErrors: true });
  }

  /**
   * Cria um novo usuário com dados fixos e dinâmicos
   * @param createUserDto DTO com dados fixos e dinâmicos do usuário
   * @param schema Esquema JSON opcional para validação dos dados dinâmicos
   */
  async createUser(createUserDto: CreateUserDto, schema?: any): Promise<Users> {
    try {
      if (schema && createUserDto.dynamicResponses) {
        await this.validateDynamicData(createUserDto.dynamicResponses, schema);
      }

      this.logger.log(`Criando usuário: ${createUserDto.nome}`);
      return this.usersRepository.create(createUserDto);
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`, error.stack);
      throw new UsersException(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Atualiza um usuário existente
   * @param id ID do usuário
   * @param data Dados de atualização
   * @param schema Esquema JSON opcional para validação dos dados dinâmicos
   */
  async updateUser(id: number, data: UpdateUserDto, schema?: any): Promise<Users> {
    try {
      if (schema && data.dynamicResponses) {
        await this.validateDynamicData(data.dynamicResponses, schema);
      }

      this.logger.log(`Atualizando usuário ${id}`);
      return this.usersRepository.update(id, data);
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário ${id}: ${error.message}`, error.stack);
      throw new UsersException(`Erro ao atualizar usuário ${id}: ${error.message}`);
    }
  }

  /**
   * Atualiza apenas os dados dinâmicos de um usuário
   * @param userId ID do usuário
   * @param dynamicData Dados dinâmicos a serem atualizados
   * @param schema Esquema JSON opcional para validação
   */
  async updateDynamicData(
    userId: number, 
    dynamicData: Record<string, any>,
    schema?: any
  ): Promise<Users> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new UsersException(`Usuário ${userId} não encontrado`);
      }

      if (schema) {
        await this.validateDynamicData(dynamicData, schema);
      }

      this.logger.log(`Atualizando dados dinâmicos do usuário ${userId}`);
      return this.usersRepository.updateDynamicResponses(userId, dynamicData);
    } catch (error) {
      this.logger.error(`Erro ao atualizar dados dinâmicos do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao atualizar dados dinâmicos: ${error.message}`);
    }
  }

  /**
   * Busca os dados dinâmicos de um usuário
   * @param userId ID do usuário
   */
  async findDynamicData(userId: number): Promise<Record<string, any> | null> {
    try {
      this.logger.log(`Buscando dados dinâmicos do usuário ${userId}`);
      return this.usersRepository.findDynamicResponses(userId);
    } catch (error) {
      this.logger.error(`Erro ao buscar dados dinâmicos do usuário ${userId}: ${error.message}`);
      throw new UsersException(`Erro ao buscar dados dinâmicos: ${error.message}`);
    }
  }

  /**
   * Valida os dados dinâmicos contra um esquema JSON
   * @param data Dados a serem validados
   * @param schema Esquema JSON para validação
   */
  private async validateDynamicData(data: Record<string, any>, schema: any): Promise<void> {
    const validate = this.ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      const errors = validate.errors?.map(err => `${err.instancePath} ${err.message}`).join('; ');
      throw new BadRequestException(`Dados dinâmicos inválidos: ${errors}`);
    }
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

  async markFormAsResponded(userId: number): Promise<Users> {
    return this.usersRepository.markFormAsResponded(userId);
  }

  async checkFormResponseById(id: number): Promise<boolean> {
    return this.usersRepository.checkFormResponse(id);
  }
}