import { registerEnumType } from '@nestjs/graphql';

export enum TeamFormType {
  MembershipRequest = 'MembershipRequest',
  Internal = 'Internal',
  Survey = 'Survey',
}

registerEnumType(TeamFormType, { name: 'TeamFormType' });
