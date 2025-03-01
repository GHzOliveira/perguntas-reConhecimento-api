import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILinkService } from 'src/interface/link.interface';

@Injectable()
export class LinkService implements ILinkService {
  constructor(private readonly configService: ConfigService) {}

  generateCompanyLink(companyId: number, domain: string): string {
    return `${domain}/identificacao/${companyId}`;
  }
}