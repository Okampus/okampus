import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';
import { PaginatedEventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';
import { GetEventApprovalStepsQuery } from './get-event-approval-steps.query';

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
