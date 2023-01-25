import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEventApprovalStepDto, UpdateEventApprovalStepDto } from '@okampus/shared/dtos';
import { UUID } from '@okampus/shared/types';
import { RequestContext } from '../../../shards/global-request/request-context';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import {
  EventApprovalStepModel,
  PaginatedEventApprovalStepModel,
} from '../../factories/events/event-approval-step.model';
import { CreateEventApprovalStepCommand } from './commands/create-event-approval-step/create-event-approval-step.command';
import { DeleteEventApprovalStepCommand } from './commands/delete-event-approval-step/delete-event-approval-step.command';
import { UpdateEventApprovalStepCommand } from './commands/update-event-approval-step/update-event-approval-step.command';
import { GetEventApprovalStepByIdQuery } from './queries/get-event-approval-step-by-id/get-event-approval-step-by-id.query';
import { GetEventApprovalStepsQuery } from './queries/get-event-approval-steps/get-event-approval-steps.query';

const defaultEventPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class EventApprovalStepsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: UUID): Promise<EventApprovalStepModel> {
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

  delete(id: UUID) {
    const command = new DeleteEventApprovalStepCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
