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
} from '@nestjs/common';
import { Prisma, UserResponse, Users } from '@prisma/client';
import { CreateUserDto } from 'src/dto/dto-users/create-user.dto';
import { UsersService } from 'src/services/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/dto-users/update-user.dto';
import { SingleUserResponseDto, UserResponseArrayDto } from 'src/dto/dto-users/user-response.dto';
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

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuário criado com sucesso',
    type: SingleUserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos' 
  })
  async createUser(@Body() userData: CreateUserDto): Promise<StandardResponseDto<Users>> {
    try {
      const user = await this.usersService.createUser(userData);
      return {
        success: true,
        message: 'Usuário criado com sucesso',
        data: user
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
    description: 'Respostas enviadas com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
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
        data: null
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
    type: UserResponseArrayDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<StandardResponse<Users>> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      success: true,
      message: 'Usuário encontrado com sucesso',
      data: user
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuários retornada com sucesso',
    type: UserResponseArrayDto
  })
  async getAllUsers(): Promise<StandardResponseDto<Users[]>> {
    const users = await this.usersService.findAllUsers();
    return {
      success: true,
      message: 'Lista de usuários retornada com sucesso',
      data: users
    };
  }

  @Get(':id/responses')
  @ApiOperation({ summary: 'Buscar respostas de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Respostas encontradas',
    type: [UserResponseArrayDto]
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async getUserResponses(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<StandardResponse<UserResponse[]>> {
    const responses = await this.usersService.findUserResponsesById(userId);
    return {
      success: true,
      message: 'Respostas do usuário retornadas com sucesso',
      data: responses
    };
  }

  @Get(':id/respondeuForm')
  @ApiOperation({ summary: 'Verificar se o usuário respondeu o formulário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status da resposta do formulário' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async getFormResponseStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StandardResponse<{ respondeuForm: boolean }>> {
    const respondeuForm = await this.usersService.checkFormResponseById(id);
    return {
      success: true,
      message: 'Status de resposta do formulário obtido com sucesso',
      data: { respondeuForm }
    };
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Buscar usuários por empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuários da empresa',
    type: [UserResponseArrayDto]
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa não encontrada' 
  })
  async getUsersByCompany(
    @Param('companyId', ParseIntPipe) companyId: number
  ): Promise<StandardResponse<Users[]>> {
    const users = await this.usersService.findUsersByCompanyId(companyId);
    return {
      success: true,
      message: 'Lista de usuários da empresa retornada com sucesso',
      data: users
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário excluído com sucesso',
    type: UserResponseArrayDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<StandardResponse<Users>> {
    const user = await this.usersService.deleteUser(id);
    return {
      success: true,
      message: 'Usuário excluído com sucesso',
      data: user
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário atualizado com sucesso',
    type: UserResponseArrayDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<StandardResponse<Users>> {
    const user = await this.usersService.updateUser(id, userData);
    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user
    };
  }

  @Patch(':id/markFormAsResponded')
  @ApiOperation({ summary: 'Marcar formulário como respondido' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Formulário marcado como respondido',
    type: UserResponseArrayDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  async markFormAsResponded(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<StandardResponse<Users>> {
    const user = await this.usersService.markFormAsResponded(userId);
    return {
      success: true,
      message: 'Formulário marcado como respondido com sucesso',
      data: user
    };
  }
}