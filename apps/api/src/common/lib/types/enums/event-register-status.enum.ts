import { registerEnumType } from '@nestjs/graphql';

export enum EventRegisterStatus {
  Sure = 'Sure',
  Maybe = 'Maybe',
  Absent = 'Absent',
}

registerEnumType(EventRegisterStatus, { name: 'EventRegisterStatus' });
