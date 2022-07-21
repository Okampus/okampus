import { registerEnumType } from '@nestjs/graphql';

export enum TeamRole {
  Owner = 'owner',
  Coowner = 'coowner',
  Treasurer = 'treasurer',
  Secretary = 'secretary',
  Manager = 'manager',
  Member = 'member',
}

registerEnumType(TeamRole, { name: 'TeamRole' });
