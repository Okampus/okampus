import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceMeans {
  Cash = 'cash',
  Card = 'card',
  Transfer = 'transfer',
  Check = 'check',
  Other = 'other',
}

registerEnumType(TeamFinanceMeans, { name: 'TeamFinanceMeans' });
