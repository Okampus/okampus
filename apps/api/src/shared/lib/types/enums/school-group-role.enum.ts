import { registerEnumType } from '@nestjs/graphql';

export enum SchoolGroupRole {
  Representative,
  Substitute,
  Student,
}

registerEnumType(SchoolGroupRole, { name: 'SchoolGroupRole' });
