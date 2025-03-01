import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../services/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from 'src/repositories/users.repositorie';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}