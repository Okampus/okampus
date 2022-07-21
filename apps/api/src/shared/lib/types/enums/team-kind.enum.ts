import { registerEnumType } from '@nestjs/graphql';

export enum TeamKind {
  Team = 'team',
  Club = 'club',
}

registerEnumType(TeamKind, { name: 'TeamKind' });
