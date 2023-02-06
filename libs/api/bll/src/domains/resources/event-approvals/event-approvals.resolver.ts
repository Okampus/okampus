// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalsService } from './event-approvals.service';

import { EventApprovalModel, PaginatedEventApprovalModel } from '../../factories/domains/events/event-approval.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateEventApprovalDto, UpdateEventApprovalDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => EventApprovalModel)
export class EventApprovalsResolver {
  constructor(private readonly eventApprovalsService: EventApprovalsService) {}

  @Query(() => EventApprovalModel)
  eventApprovalById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalsService.findOneById(id);
  }

  @Query(() => PaginatedEventApprovalModel)
  eventApprovals(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.eventApprovalsService.find(options);
  }

  @Mutation(() => EventApprovalModel)
  createEventApproval(
    @Args('eventApproval', { type: () => CreateEventApprovalDto }) eventApproval: CreateEventApprovalDto
  ) {
    return this.eventApprovalsService.create(eventApproval);
  }

  @Mutation(() => EventApprovalModel)
  updateEventApproval(
    @Args('updateEventApproval', { type: () => UpdateEventApprovalDto }) updateEventApproval: UpdateEventApprovalDto
  ) {
    return this.eventApprovalsService.update(updateEventApproval);
  }

  @Mutation(() => Boolean)
  deleteEventApproval(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalsService.delete(id);
  }
}
