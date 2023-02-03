import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { EventApprovalsService } from './event-approvals.service';
import { CreateEventApprovalDto, UpdateEventApprovalDto } from '@okampus/shared/dtos';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Snowflake } from '@okampus/shared/types';
import { EventApprovalModel, PaginatedEventApprovalModel } from '../../factories/domains/events/event-approval.model';

@Resolver(() => EventApprovalModel)
export class EventApprovalsResolver {
  constructor(private readonly eventApprovalsService: EventApprovalsService) {}

  @Query(() => EventApprovalModel)
  eventApprovalById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalsService.findOneById(id);
  }

  @Query(() => PaginatedEventApprovalModel)
  eventApprovals(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.eventApprovalsService.find(options);
  }

  @Mutation(() => EventApprovalModel)
  createEventApproval(@Args('eventApproval') eventApproval: CreateEventApprovalDto) {
    return this.eventApprovalsService.create(eventApproval);
  }

  @Mutation(() => EventApprovalModel)
  updateEventApproval(@Args('updateEventApproval') updateEventApproval: UpdateEventApprovalDto) {
    return this.eventApprovalsService.update(updateEventApproval);
  }

  @Mutation(() => Boolean)
  deleteEventApproval(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventApprovalsService.delete(id);
  }
}
