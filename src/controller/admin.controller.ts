import { Body, Controller, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Public, Roles } from 'src/decorators/roles.decorator';
import { CreateAdminDto } from 'src/dto/dto-admin/create-admin.dto';
import { LoginDto } from 'src/dto/dto-admin/login.dto';
import { AdminService } from 'src/services/admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Administração')
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticação de administrador' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Administrador autenticado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciais inválidas' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.adminService.validateAdmin(loginDto);
  }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo administrador' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Administrador criado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sem permissão para criar administrador' 
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
}