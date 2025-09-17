import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './modules/admin.module';
import { FormBuilderModule } from './modules/form-builder.module';
import { FilialModule } from './modules/filial.module';
import { UsersModule } from './modules/users.module';
import { CalculoModule } from './modules/calculo.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, securityConfig } from './config/environment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { CompanyModule } from './modules/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, securityConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AdminModule,
    FormBuilderModule,
    FilialModule,
    UsersModule,
    CalculoModule,
    CompanyModule,
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
