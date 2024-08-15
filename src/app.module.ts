import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './modules/admin/admin.module';
import { FormVisibilityModule } from './modules/form-visibility/form-visibility.module';
import { FilialModule } from './modules/filial/filial.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AdminModule, FormVisibilityModule, FilialModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
