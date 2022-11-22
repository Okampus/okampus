import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventRegisterStatus {
  Sure = 'Sure',
  Maybe = 'Maybe',
  Absent = 'Absent',
}

registerEnumType(TeamEventRegisterStatus, { name: 'TeamEventRegisterStatus' });
