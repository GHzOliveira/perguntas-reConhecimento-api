import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ success: boolean }> {
    const isValid = await this.adminService.validateAdmin(loginDto);
    return { success: isValid };
  }
}
