import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../services/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from 'src/repositories/users.repositorie';
import { UserMockService } from 'src/services/user-mock.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService, UserMockService],
  exports: [UsersService],
})
export class UsersModule {}