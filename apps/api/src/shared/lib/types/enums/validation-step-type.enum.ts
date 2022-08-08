import { registerEnumType } from '@nestjs/graphql';

export enum ValidationStepType {
  TeamEvent = 'team-event',
}

registerEnumType(ValidationStepType, { name: 'ValidationStepType' });
