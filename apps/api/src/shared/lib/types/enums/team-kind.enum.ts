import { registerEnumType } from '@nestjs/graphql';

export enum TeamKind {
  Department = 'department',
  Club = 'club',
}

registerEnumType(TeamKind, { name: 'TeamKind' });
