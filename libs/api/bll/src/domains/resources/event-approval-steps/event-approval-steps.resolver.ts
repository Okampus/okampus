// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepsService } from './event-approval-steps.service';
import { EventApprovalStepModel, PaginatedEventApprovalStepModel } from '../../factories';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';

import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateEventApprovalStepDto, UpdateEventApprovalStepDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => EventApprovalStepModel)
export class EventApprovalStepsResolver {
  constructor(private readonly eventApprovalStepsService: EventApprovalStepsService) {}

  @Query(() => EventApprovalStepModel)
  eventApprovalStepById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalStepsService.findOneById(id);
  }

  @Query(() => PaginatedEventApprovalStepModel)
  eventApprovalSteps(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.eventApprovalStepsService.find(options);
  }

  @Mutation(() => EventApprovalStepModel)
  createEventApprovalStep(
    @Args('eventApprovalStep', { type: () => CreateEventApprovalStepDto }) eventApprovalStep: CreateEventApprovalStepDto
  ) {
    return this.eventApprovalStepsService.create(eventApprovalStep);
  }

  @Mutation(() => EventApprovalStepModel)
  updateEventApprovalStep(
    @Args('updateEventApprovalStep', { type: () => UpdateEventApprovalStepDto })
    updateEventApprovalStep: UpdateEventApprovalStepDto
  ) {
    return this.eventApprovalStepsService.update(updateEventApprovalStep);
  }

  @Mutation(() => Boolean)
  deleteEventApprovalStep(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalStepsService.delete(id);
  }
}
