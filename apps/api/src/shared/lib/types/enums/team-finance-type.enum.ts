import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceType {
  Expense = 'Expense',
  Income = 'Income',
}

registerEnumType(TeamFinanceType, { name: 'TeamFinanceType' });
