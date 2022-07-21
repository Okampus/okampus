import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceCategory {
  Entertainment,
  Equipement,
  Errands,
  Fees,
  Insurance,
  Logistics,
  Marketing,
  Provider,
  Subscriptions,
  Transportation,
  Other,
}

registerEnumType(TeamFinanceCategory, { name: 'TeamFinanceCategory' });
