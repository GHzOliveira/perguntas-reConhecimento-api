import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserResponse, Users } from '@prisma/client';
import { CreateUserDto } from 'src/dto/dto-users/create-user.dto';
import { UsersService } from 'src/services/users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/dto-users/update-user.dto';
import {
  SingleUserResponseDto,
  UserResponseArrayDto,
} from 'src/dto/dto-users/user-response.dto';
import { StandardResponseDto } from 'src/dto/common/standard-response.dto';

interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Método auxiliar privado para obter o esquema ativo para uma empresa
  private async getActiveSchemaForCompany(companyId: number): Promise<any> {
    // Aqui você poderia implementar uma lógica para buscar o esquema ativo para a empresa
    // Por exemplo, usando um serviço de formulário dinâmico

    // Este é um exemplo simplificado, substitua pela implementação real
    return {
      type: 'object',
      properties: {
        // Esquema baseado nas necessidades da empresa
      },
      additionalProperties: true,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário com suporte a dados dinâmicos' })
  @ApiBody({ type: CreateUserDto })
  @ApiQuery({
    name: 'validateSchema',
    required: false,
    type: Boolean,
    description: 'Se true, valida os dados dinâmicos contra o esquema ativo',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
    type: SingleUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou esquema de validação inválido',
  })
  async createUser(
    @Body() userData: CreateUserDto,
    @Query('validateSchema') validateSchema?: boolean,
  ): Promise<StandardResponseDto<Users>> {
    try {
      const schema = validateSchema
        ? await this.getActiveSchemaForCompany(userData.companyId)
        : undefined;

      const user = await this.usersService.createUser(userData, schema);
      return {
        success: true,
        message: 'Usuário criado com sucesso',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/responses')
  @ApiOperation({ summary: 'Enviar respostas de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Respostas enviadas com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async submitResponses(
    @Param('id', ParseIntPipe) userId: number,
    @Body() responses: Record<string, number>,
  ): Promise<StandardResponse<void>> {
    try {
      await this.usersService.submitUserResponse(userId, responses);
      return {
        success: true,
        message: 'Respostas enviadas com sucesso',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado',
    type: UserResponseArrayDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StandardResponse<Users>> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      success: true,
      message: 'Usuário encontrado com sucesso',
      data: user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários retornada com sucesso',
    type: UserResponseArrayDto,
  })
  async getAllUsers(): Promise<StandardResponseDto<Users[]>> {
    const users = await this.usersService.findAllUsers();
    return {
      success: true,
      message: 'Lista de usuários retornada com sucesso',
      data: users,
    };
  }

  @Get(':id/responses')
  @ApiOperation({ summary: 'Buscar respostas de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Respostas encontradas',
    type: [UserResponseArrayDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async getUserResponses(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<StandardResponse<UserResponse[]>> {
    const responses = await this.usersService.findUserResponsesById(userId);
    return {
      success: true,
      message: 'Respostas do usuário retornadas com sucesso',
      data: responses,
    };
  }

  @Get(':id/respondeuForm')
  @ApiOperation({ summary: 'Verificar se o usuário respondeu o formulário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status da resposta do formulário',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async getFormResponseStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StandardResponse<{ respondeuForm: boolean }>> {
    const respondeuForm = await this.usersService.checkFormResponseById(id);
    return {
      success: true,
      message: 'Status de resposta do formulário obtido com sucesso',
      data: { respondeuForm },
    };
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Buscar usuários por empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários da empresa',
    type: [UserResponseArrayDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada',
  })
  async getUsersByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<StandardResponse<Users[]>> {
    const users = await this.usersService.findUsersByCompanyId(companyId);
    return {
      success: true,
      message: 'Lista de usuários da empresa retornada com sucesso',
      data: users,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário excluído com sucesso',
    type: UserResponseArrayDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StandardResponse<Users>> {
    const user = await this.usersService.deleteUser(id);
    return {
      success: true,
      message: 'Usuário excluído com sucesso',
      data: user,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário com suporte a dados dinâmicos' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiQuery({
    name: 'validateSchema',
    required: false,
    type: Boolean,
    description: 'Se true, valida os dados dinâmicos contra o esquema ativo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso',
    type: SingleUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou esquema de validação inválido',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
    @Query('validateSchema') validateSchema?: boolean,
  ): Promise<StandardResponse<Users>> {
    try {
      let schema;
      if (validateSchema && userData.dynamicResponses) {
        const user = await this.usersService.findUserById(id);
        if (user) {
          schema = await this.getActiveSchemaForCompany(user.companyId);
        }
      }

      const user = await this.usersService.updateUser(id, userData, schema);
      return {
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/markFormAsResponded')
  @ApiOperation({ summary: 'Marcar formulário como respondido' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Formulário marcado como respondido',
    type: UserResponseArrayDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async markFormAsResponded(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<StandardResponse<Users>> {
    const user = await this.usersService.markFormAsResponded(userId);
    return {
      success: true,
      message: 'Formulário marcado como respondido com sucesso',
      data: user,
    };
  }

  /**
   * Novo endpoint para atualizar somente os dados dinâmicos
   */
  @Patch(':id/dynamic-responses')
  @ApiOperation({
    summary: 'Atualizar apenas os dados dinâmicos de um usuário',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: true,
      description: 'Dados dinâmicos do usuário',
    },
  })
  @ApiQuery({
    name: 'validateSchema',
    required: false,
    type: Boolean,
    description: 'Se true, valida os dados dinâmicos contra o esquema ativo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados dinâmicos atualizados com sucesso',
    type: SingleUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados dinâmicos inválidos',
  })
  async updateDynamicResponses(
    @Param('id', ParseIntPipe) id: number,
    @Body() dynamicData: Record<string, any>,
    @Query('validateSchema') validateSchema?: boolean,
  ): Promise<StandardResponse<Users>> {
    try {
      let schema;
      if (validateSchema) {
        const user = await this.usersService.findUserById(id);
        if (user) {
          schema = await this.getActiveSchemaForCompany(user.companyId);
        }
      }

      const user = await this.usersService.updateDynamicData(
        id,
        dynamicData,
        schema,
      );
      return {
        success: true,
        message: 'Dados dinâmicos atualizados com sucesso',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Novo endpoint para buscar somente os dados dinâmicos
   */
  @Get(':id/dynamic-responses')
  @ApiOperation({ summary: 'Buscar os dados dinâmicos de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados dinâmicos encontrados',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Dados dinâmicos encontrados com sucesso',
        },
        data: {
          type: 'object',
          additionalProperties: true,
          example: {
            idade: 30,
            departamento: 'TI',
            habilidades: ['JavaScript', 'NestJS'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou dados dinâmicos não disponíveis',
  })
  async getDynamicResponses(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StandardResponse<Record<string, any> | null>> {
    const dynamicData = await this.usersService.findDynamicData(id);

    if (!dynamicData) {
      throw new NotFoundException(
        'Dados dinâmicos não encontrados para este usuário',
      );
    }

    return {
      success: true,
      message: 'Dados dinâmicos encontrados com sucesso',
      data: dynamicData,
    };
  }
}
