import { registerEnumType } from '@nestjs/graphql';

export enum ApprovalStepType {
  Event = 'Event',
}

registerEnumType(ApprovalStepType, { name: 'ApprovalStepType' });
