import { CreateEventApprovalCommand } from './commands/create-event-approval/create-event-approval.command';
import { DeleteEventApprovalCommand } from './commands/delete-event-approval/delete-event-approval.command';
import { UpdateEventApprovalCommand } from './commands/update-event-approval/update-event-approval.command';
import { GetEventApprovalByIdQuery } from './queries/get-event-approval-by-id/get-event-approval-by-id.query';
import { GetEventApprovalsQuery } from './queries/get-event-approvals/get-event-approvals.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { Injectable } from '@nestjs/common';
import type { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateEventApprovalDto, UpdateEventApprovalDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { EventApprovalModel, PaginatedEventApprovalModel } from '../../factories/domains/events/event-approval.model';

const defaultEventPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class EventApprovalsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<EventApprovalModel> {
    const query = new GetEventApprovalByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultEventPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedEventApprovalModel> {
    const query = new GetEventApprovalsQuery(
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultEventPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createEventApproval: CreateEventApprovalDto): Promise<EventApprovalModel> {
    const command = new CreateEventApprovalCommand(createEventApproval, this.tenant(), this.requester());
    return this.commandBus.execute(command);
  }

  update(updateEventApproval: UpdateEventApprovalDto): Promise<EventApprovalModel> {
    const command = new UpdateEventApprovalCommand(
      updateEventApproval,
      this.tenant(),
      this.autoGqlPopulate(defaultEventPopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteEventApprovalCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
