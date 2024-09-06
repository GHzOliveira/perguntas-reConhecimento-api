import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FormVisibilityService {
    constructor(private prisma: PrismaService) {}

    async getVisibility() {
        return this.prisma.formVisibility.findMany();
      }
    
      async updateVisibility(field: string, isVisible: boolean) {
        return this.prisma.formVisibility.upsert({
          where: { field },
          update: { isVisible },
          create: { field, isVisible },
        });
      }
}
