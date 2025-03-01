export interface ILinkService {
    generateCompanyLink(companyId: number, domain: string): string;
  }