import { GetEventApprovalStepsQuery } from './get-event-approval-steps.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedEventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';

@QueryHandler(GetEventApprovalStepsQuery)
export class GetEventApprovalStepsHandler implements IQueryHandler<GetEventApprovalStepsQuery> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(query: GetEventApprovalStepsQuery): Promise<PaginatedEventApprovalStepModel> {
    return await this.eventApprovalStepFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
