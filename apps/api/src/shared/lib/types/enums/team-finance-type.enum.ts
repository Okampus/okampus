import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceType {
  Expense = 'expense',
  Income = 'income',
}

registerEnumType(TeamFinanceType, { name: 'TeamFinanceType' });
