import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceCategory {
  Entertainment = 'Entertainment',
  Equipement = 'Equipement',
  Errands = 'Errands',
  Fees = 'Fees',
  Insurance = 'Insurance',
  Logistics = 'Logistics',
  Marketing = 'Marketing',
  Provider = 'Provider',
  Subscriptions = 'Subscriptions',
  Transportation = 'Transportation',
  Other = 'Other',
}

registerEnumType(TeamFinanceCategory, { name: 'TeamFinanceCategory' });
