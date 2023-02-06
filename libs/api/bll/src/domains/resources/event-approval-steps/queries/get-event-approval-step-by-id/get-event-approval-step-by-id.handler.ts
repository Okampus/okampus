import { GetEventApprovalStepByIdQuery } from './get-event-approval-step-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';

import type { EventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';

@QueryHandler(GetEventApprovalStepByIdQuery)
export class GetEventApprovalStepByIdHandler implements IQueryHandler<GetEventApprovalStepByIdQuery> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(query: GetEventApprovalStepByIdQuery): Promise<EventApprovalStepModel> {
    return await this.eventApprovalStepFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
