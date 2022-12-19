import { registerEnumType } from '@nestjs/graphql';

export enum EventRegistrationStatus {
  Sure = 'Sure',
  Maybe = 'Maybe',
  Absent = 'Absent',
}

registerEnumType(EventRegistrationStatus, { name: 'EventRegistrationStatus' });
