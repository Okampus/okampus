import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'User',
  Moderator = 'Moderator',
  CafeteriaManager = 'CafeteriaManager',
  ClubManager = 'ClubManager',
  TenantAdmin = 'TenantAdmin',
}

registerEnumType(Role, { name: 'Role' });
