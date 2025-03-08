import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILinkService } from 'src/interface/link.interface';

@Injectable()
export class LinkService implements ILinkService {
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    this.domain =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  }

  generateCompanyLink(companyId: number, domain: string = this.domain): string {
    return `${domain}/identificacao/${companyId}`;
  }
}
