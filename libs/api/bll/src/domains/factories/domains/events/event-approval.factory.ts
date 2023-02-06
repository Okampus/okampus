import { EventApprovalModel } from './event-approval.model';
import { BaseFactory } from '../../base.factory';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { EventApproval } from '@okampus/api/dal';
import { EventState } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  EventApprovalRepository,
  EventApprovalStepRepository,
  TenantEventRepository,
  TenantRepository,
} from '@okampus/api/dal';

import type { EventApprovalOptions, EventApprovalStep, Individual, TenantCore, TenantEvent } from '@okampus/api/dal';
import type { CreateEventApprovalDto, IEventApproval } from '@okampus/shared/dtos';

@Injectable()
export class EventApprovalFactory extends BaseFactory<
  EventApprovalModel,
  EventApproval,
  IEventApproval,
  EventApprovalOptions
> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly eventApprovalStepRepository: EventApprovalStepRepository,
    private readonly eventRepository: TenantEventRepository,
    private readonly tenantRepository: TenantRepository,
    eventApprovalRepository: EventApprovalRepository
  ) {
    super(ep, eventApprovalRepository, EventApprovalModel, EventApproval);
  }

  async createEventApproval(
    createEventApproval: CreateEventApprovalDto,
    tenant: TenantCore,
    requester: Individual
  ): Promise<EventApprovalModel> {
    const step = await this.eventApprovalStepRepository.findById(createEventApproval.stepId);
    if (!step) throw new BadRequestException('Invalid step id');

    const event = await this.eventRepository.findById(createEventApproval.eventId);
    if (!event) throw new BadRequestException('Invalid event id');

    const tenantOrg = await this.tenantRepository.findOneOrFail({ tenant }, { populate: ['eventApprovalSteps'] });

    event.lastEventApprovalStep = step;

    if (!createEventApproval.approved) {
      event.state = EventState.Rejected;
    } else if (event.lastEventApprovalStep?.order === tenantOrg.eventApprovalSteps.length) {
      event.state = EventState.Approved;
    }

    return this.create({
      ...createEventApproval,
      event,
      createdBy: requester,
      step,
      tenant,
    });
  }

  modelToEntity(model: Required<EventApprovalModel>): EventApproval {
    return new EventApproval({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      event: { id: model.event.id } as TenantEvent,
      createdBy: { id: model.createdBy.id } as Individual,
      step: { id: model.step.id } as EventApprovalStep,
    });
  }
}
