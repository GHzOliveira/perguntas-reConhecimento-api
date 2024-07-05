import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { FormVisibilityModule } from './form-visibility/form-visibility.module';
import { FilialModule } from './filial/filial.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AdminModule, FormVisibilityModule, FilialModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
