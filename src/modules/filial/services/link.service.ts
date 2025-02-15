import { Injectable } from '@nestjs/common';
import { ILinkService } from '../interface/link.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkService implements ILinkService {
  constructor(private readonly configService: ConfigService) {}

  generateCompanyLink(companyId: number, domain: string): string {
    return `${domain}/identificacao/${companyId}`;
  }
}