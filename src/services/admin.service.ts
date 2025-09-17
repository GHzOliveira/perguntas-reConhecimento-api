import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/dto-admin/login.dto';
import { CreateAdminDto } from '../dto/dto-admin/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAdminRepository } from 'src/interface/admin.interface';

@Injectable()
export class AdminService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(loginDto: LoginDto): Promise<{ token: string }> {
    const admin = await this.adminRepository.findByLogin(loginDto.login);
    
    if (!admin) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.senha, admin.senha);

    if (!isPasswordValid || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ 
      sub: admin.id, 
      login: admin.login,
      role: admin.role 
    });

    return { token };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.senha, 10);
    
    return this.adminRepository.create({
      ...createAdminDto,
      senha: hashedPassword,
    });
  }
}