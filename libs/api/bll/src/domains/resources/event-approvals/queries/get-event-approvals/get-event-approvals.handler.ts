import { GetEventApprovalsQuery } from './get-event-approvals.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedEventApprovalModel } from '../../../../factories/domains/events/event-approval.model';

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
