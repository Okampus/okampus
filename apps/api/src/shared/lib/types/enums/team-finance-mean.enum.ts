import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceMean {
  Cash = 'cash',
  Card = 'card',
  Transfer = 'transfer',
  Check = 'check',
  Other = 'other',
}

registerEnumType(TeamFinanceMean, { name: 'TeamFinanceMean' });
