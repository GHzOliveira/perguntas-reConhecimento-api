import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async validateAdmin(loginDto: LoginDto): Promise<boolean> {
      const { login, senha } = loginDto;
      if (!login) {
          throw new Error('Login is required');
      }
      const admin = await this.prisma.admin.findUnique({
        where: {
          login,
        },
      });
  
      return admin && admin.senha === senha && admin.role === 'ADMIN';
  }
}

