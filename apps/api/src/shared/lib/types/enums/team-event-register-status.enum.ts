import { registerEnumType } from '@nestjs/graphql';

export enum TeamEventRegisterStatus {
  Sure = 'sure',
  Maybe = 'maybe',
  NotSure = 'notsure',
}

registerEnumType(TeamEventRegisterStatus, { name: 'TeamEventRegisterStatus' });
