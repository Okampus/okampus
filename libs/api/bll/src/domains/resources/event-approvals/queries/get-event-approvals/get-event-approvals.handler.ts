import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';
import { PaginatedEventApprovalModel } from '../../../../factories/domains/events/event-approval.model';
import { GetEventApprovalsQuery } from './get-event-approvals.query';

@QueryHandler(GetEventApprovalsQuery)
export class GetEventApprovalsHandler implements IQueryHandler<GetEventApprovalsQuery> {
  constructor(private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(query: GetEventApprovalsQuery): Promise<PaginatedEventApprovalModel> {
    return await this.eventApprovalFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
