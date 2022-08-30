import { registerEnumType } from '@nestjs/graphql';

export enum TeamRole {
  Owner = 'Owner',
  Coowner = 'Coowner',
  Treasurer = 'Treasurer',
  Secretary = 'Secretary',
  Manager = 'Manager',
  Member = 'Member',
}

registerEnumType(TeamRole, { name: 'TeamRole' });
