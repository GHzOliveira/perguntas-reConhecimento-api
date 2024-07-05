import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserResponse, Users } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: Users): Promise<Users> {
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
}
