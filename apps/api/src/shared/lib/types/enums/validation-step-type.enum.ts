import { registerEnumType } from '@nestjs/graphql';

export enum ValidationStepType {
  TeamEvent = 'TeamEvent',
}

registerEnumType(ValidationStepType, { name: 'ValidationStepType' });
