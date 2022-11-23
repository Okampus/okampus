import { registerEnumType } from '@nestjs/graphql';

export enum TeamHistoryState {
  Started = 'Started',
  Recognized = 'Recognized',
  Modified = 'Modified',
  Declared = 'Declared',
  Undeclared = 'Undeclared',
  Ended = 'Ended',
}

registerEnumType(TeamHistoryState, { name: 'TeamHistoryState' });
