import { EventApprovalModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  EventApprovalRepository,
  EventApprovalStepRepository,
  TenantEventRepository,
  TenantRepository,
  EventApprovalStep,
} from '@okampus/api/dal';
import { EventApproval, Individual, TenantCore, TenantEvent } from '@okampus/api/dal';
import { EventState } from '@okampus/shared/enums';

import type { EventApprovalOptions } from '@okampus/api/dal';
import type { CreateEventApprovalDto, IEventApproval } from '@okampus/shared/dtos';

@Injectable()
export class EventApprovalFactory extends BaseFactory<
  EventApprovalModel,
  EventApproval,
  IEventApproval,
  EventApprovalOptions
> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    eventApprovalRepository: EventApprovalRepository,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly eventApprovalStepRepository: EventApprovalStepRepository,
    private readonly eventRepository: TenantEventRepository,
    private readonly tenantRepository: TenantRepository
  ) {
    super(eventPublisher, uploadService, eventApprovalRepository, EventApprovalModel, EventApproval);
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

    const linkedTenant = await this.tenantRepository.findOneOrFail({ tenant }, { populate: ['eventApprovalSteps'] });
    event.lastEventApprovalStep = step;

    if (!createEventApproval.approved) {
      event.state = EventState.Rejected;
    } else if (event.lastEventApprovalStep?.stepOrder === linkedTenant.eventApprovalSteps.length - 1) {
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
      event: this.em.getReference(TenantEvent, model.event.id),
      step: this.em.getReference(EventApprovalStep, model.step.id),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
