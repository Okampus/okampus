import { registerEnumType } from '@nestjs/graphql';

export enum TeamHistoryState {
  Started = 'Started',
  Declared = 'Declared',
  Recognized = 'Recognized',
  Ended = 'Ended',
  Terminated = 'Terminated',
  Modified = 'Modified',
}

registerEnumType(TeamHistoryState, { name: 'TeamHistoryState' });
