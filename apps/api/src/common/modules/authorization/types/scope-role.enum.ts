import { registerEnumType } from '@nestjs/graphql';

export enum ScopeRole {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
  AdminBot = 'AdminBot',
  UserBot = 'UserBot',
}

registerEnumType(ScopeRole, { name: 'ScopeRole' });
