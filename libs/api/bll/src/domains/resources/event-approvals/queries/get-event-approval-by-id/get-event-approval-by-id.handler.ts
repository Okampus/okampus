import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';
import type { EventApprovalModel } from '../../../../factories/domains/events/event-approval.model';
import { GetEventApprovalByIdQuery } from './get-event-approval-by-id.query';

@QueryHandler(GetEventApprovalByIdQuery)
export class GetEventApprovalByIdHandler implements IQueryHandler<GetEventApprovalByIdQuery> {
  constructor(private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(query: GetEventApprovalByIdQuery): Promise<EventApprovalModel> {
    return await this.eventApprovalFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
