import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventRegisterStatus {
  Sure = 'sure',
  Maybe = 'maybe',
  Absent = 'absent',
}

registerEnumType(TeamEventRegisterStatus, { name: 'TeamEventRegisterStatus' });
