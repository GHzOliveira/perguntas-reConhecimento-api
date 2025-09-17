import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from 'src/dto/dto-admin/create-admin.dto';
import { IAdminRepository } from 'src/interface/admin.interface';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByLogin(login: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { login },
    });
  }

  async create(data: CreateAdminDto): Promise<Admin> {
    return this.prisma.admin.create({
      data,
    });
  }
}