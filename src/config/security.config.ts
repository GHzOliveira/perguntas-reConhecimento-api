import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'https:'],
      scriptSrc: [`'self'`],
    },
  },
  xssFilter: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  frameguard: {
    action: 'deny'
  },
};