import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from 'src/repositories/admin.repositorie';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    PrismaService,
    JwtStrategy,
    {
      provide: 'IAdminRepository',
      useClass: AdminRepository,
    },
  ],
  exports: [AdminService],
})
export class AdminModule {}
