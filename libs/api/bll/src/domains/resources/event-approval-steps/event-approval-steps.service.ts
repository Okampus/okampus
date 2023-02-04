import { CreateEventApprovalStepCommand } from './commands/create-event-approval-step/create-event-approval-step.command';
import { DeleteEventApprovalStepCommand } from './commands/delete-event-approval-step/delete-event-approval-step.command';
import { UpdateEventApprovalStepCommand } from './commands/update-event-approval-step/update-event-approval-step.command';
import { GetEventApprovalStepByIdQuery } from './queries/get-event-approval-step-by-id/get-event-approval-step-by-id.query';
import { GetEventApprovalStepsQuery } from './queries/get-event-approval-steps/get-event-approval-steps.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { Injectable } from '@nestjs/common';
import type { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateEventApprovalStepDto, UpdateEventApprovalStepDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type {
  EventApprovalStepModel,
  PaginatedEventApprovalStepModel,
} from '../../factories/domains/events/event-approval-step.model';

const defaultEventPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class EventApprovalStepsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<EventApprovalStepModel> {
    const query = new GetEventApprovalStepByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultEventPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedEventApprovalStepModel> {
    const query = new GetEventApprovalStepsQuery(
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultEventPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createEventApprovalStep: CreateEventApprovalStepDto): Promise<EventApprovalStepModel> {
    const command = new CreateEventApprovalStepCommand(createEventApprovalStep, this.tenant(), this.requester());
    return this.commandBus.execute(command);
  }

  update(updateEventApprovalStep: UpdateEventApprovalStepDto): Promise<EventApprovalStepModel> {
    const command = new UpdateEventApprovalStepCommand(
      updateEventApprovalStep,
      this.tenant(),
      this.autoGqlPopulate(defaultEventPopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteEventApprovalStepCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
