import { registerEnumType } from '@nestjs/graphql';

export enum TeamKind {
  SchoolDepartment = 'SchoolDepartment',
  Club = 'Club',
}

registerEnumType(TeamKind, { name: 'TeamKind' });
