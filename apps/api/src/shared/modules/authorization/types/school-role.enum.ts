import { registerEnumType } from '@nestjs/graphql';

export enum SchoolRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

registerEnumType(SchoolRole, { name: 'SchoolRole' });
