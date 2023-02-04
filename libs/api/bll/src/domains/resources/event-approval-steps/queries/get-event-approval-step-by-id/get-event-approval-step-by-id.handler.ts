import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';
import type { EventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';
import { GetEventApprovalStepByIdQuery } from './get-event-approval-step-by-id.query';

@QueryHandler(GetEventApprovalStepByIdQuery)
export class GetEventApprovalStepByIdHandler implements IQueryHandler<GetEventApprovalStepByIdQuery> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(query: GetEventApprovalStepByIdQuery): Promise<EventApprovalStepModel> {
    return await this.eventApprovalStepFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
