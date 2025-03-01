import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Public, Roles } from 'src/decorators/roles.decorator';
import { CreateAdminDto } from 'src/dto/dto-admin/create-admin.dto';
import { LoginDto } from 'src/dto/dto-admin/login.dto';
import { AdminService } from 'src/services/admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.adminService.validateAdmin(loginDto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
}