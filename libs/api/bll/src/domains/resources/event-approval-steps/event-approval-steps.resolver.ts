import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { EventApprovalStepsService } from './event-approval-steps.service';
import { CreateEventApprovalStepDto, UpdateEventApprovalStepDto } from '@okampus/shared/dtos';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { UUID } from '@okampus/shared/types';
import {
  EventApprovalStepModel,
  PaginatedEventApprovalStepModel,
} from '../../factories/events/event-approval-step.model';

@Resolver(() => EventApprovalStepModel)
export class EventApprovalStepsResolver {
  constructor(private readonly eventApprovalStepsService: EventApprovalStepsService) {}

  @Query(() => EventApprovalStepModel)
  eventApprovalStepById(@Args('id', { type: () => String }) id: UUID) {
    return this.eventApprovalStepsService.findOneById(id);
  }

  @Query(() => PaginatedEventApprovalStepModel)
  eventApprovalSteps(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.eventApprovalStepsService.find(options);
  }

  @Mutation(() => EventApprovalStepModel)
  createEventApprovalStep(@Args('eventApprovalStep') eventApprovalStep: CreateEventApprovalStepDto) {
    return this.eventApprovalStepsService.create(eventApprovalStep);
  }

  @Mutation(() => EventApprovalStepModel)
  updateEventApprovalStep(@Args('updateEventApprovalStep') updateEventApprovalStep: UpdateEventApprovalStepDto) {
    return this.eventApprovalStepsService.update(updateEventApprovalStep);
  }

  @Mutation(() => Boolean)
  deleteEventApprovalStep(@Args('id', { type: () => String }) id: UUID) {
    return this.eventApprovalStepsService.delete(id);
  }
}
