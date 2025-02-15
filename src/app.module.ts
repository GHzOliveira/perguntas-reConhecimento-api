import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './modules/admin/admin.module';
import { FormVisibilityModule } from './modules/form-visibility/form-visibility.module';
import { FilialModule } from './modules/filial/filial.module';
import { UsersModule } from './modules/users/users.module';
import { CalculoModule } from './modules/calculo/calculo.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, securityConfig } from './config/environment';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, securityConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AdminModule,
    FormVisibilityModule,
    FilialModule,
    UsersModule,
    CalculoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    PrismaService,
  ],
})
export class AppModule {}
