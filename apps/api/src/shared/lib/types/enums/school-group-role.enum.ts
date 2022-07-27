import { registerEnumType } from '@nestjs/graphql';

export enum SchoolGroupRole {
  Representative = 'representative',
  Substitute = 'substitute',
  Student = 'student',
}

registerEnumType(SchoolGroupRole, { name: 'SchoolGroupRole' });
