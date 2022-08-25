import { registerEnumType } from '@nestjs/graphql';

export enum TeamFormType {
  MembershipRequest = 'MembershipRequest',
  Internal = 'Internal',
  EventRegistration = 'EventRegistration',
  Survey = 'Survey',
}

registerEnumType(TeamFormType, { name: 'TeamFormType' });
