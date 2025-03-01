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
} from '@nestjs/common';
import { Prisma, UserResponse, Users } from '@prisma/client';
import { CreateUserDto } from 'src/dto/dto-users/create-user.dto';
import { UsersService } from 'src/services/users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(userData);
  }

  @Post(':id/responses')
  async submitResponses(
    @Param('id', ParseIntPipe) userId: number,
    @Body() responses: Record<string, number>,
  ): Promise<void> {
    await this.usersService.submitUserResponse(userId, responses);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async getAllUsers(): Promise<Users[]> {
    return this.usersService.findAllUsers();
  }

  @Get(':id/responses')
  async getUserResponses(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserResponse[]> {
    return this.usersService.findUserResponsesById(userId);
  }

  @Get(':id/respondeuForm')
  async getFormResponseStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ respondeuForm: boolean }> {
    const respondeuForm = await this.usersService.checkFormResponseById(id);
    return { respondeuForm };
  }

  @Get('company/:companyId')
  async getUsersByCompany(
    @Param('companyId', ParseIntPipe) companyId: number
  ): Promise<Users[]> {
    return this.usersService.findUsersByCompanyId(companyId);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Prisma.UsersUpdateInput,
  ): Promise<Users> {
    return this.usersService.updateUser(id, userData);
  }

  @Patch(':id/markFormAsResponded')
  async markFormAsResponded(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Users> {
    return this.usersService.markFormAsResponded(userId);
  }
}