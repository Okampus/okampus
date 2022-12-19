import { registerEnumType } from '@nestjs/graphql';

export enum TeamFinanceState {
  Canceled = 'Canceled',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
}

registerEnumType(TeamFinanceState, { name: 'TeamFinanceState' });
